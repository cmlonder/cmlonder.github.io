#!/usr/bin/env bash
# Cutover doğrulaması.
#
# DNS sorguları DoH (DNS-over-HTTPS) ile yapılıyor, `dig` ile değil:
# yerel çözümleyici bir kaydın "yok" olduğunu negatif önbelleğe alırsa
# (negatif TTL burada 1800s) dig dakikalarca yanlış cevap verir ve
# cutover'ı başarısız sanırsın.
set -uo pipefail

DOMAIN=cmlonder.com
PAGES=cmlonder.github.io
REPO=cmlonder/cmlonder.github.io

ok(){ printf "  \033[32m✓\033[0m %s\n" "$1"; }
no(){ printf "  \033[31m✗\033[0m %s\n" "$1"; }
wa(){ printf "  \033[33m!\033[0m %s\n" "$1"; }

# doh <isim> <tip> -> her satırda bir cevap
doh(){
  curl -s --max-time 15 -H 'accept: application/dns-json' \
    "https://cloudflare-dns.com/dns-query?name=$1&type=$2" \
  | python3 -c "import sys,json;print('\n'.join(a['data'] for a in json.load(sys.stdin).get('Answer',[])))" 2>/dev/null
}

echo "── DNS (DoH ile, yerel önbellekten bağımsız) ──"
A=$(doh $DOMAIN A | sort | tr '\n' ' ')
want="185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153 "
[ "$A" = "$want" ] && ok "apex A -> GitHub Pages" || no "apex A: ${A:-yok}  (beklenen: $want)"

AAAA=$(doh $DOMAIN AAAA | sort | tr '\n' ' ')
if [ -n "$AAAA" ]; then
  [ "$AAAA" = "2606:50c0:8000::153 2606:50c0:8001::153 2606:50c0:8002::153 2606:50c0:8003::153 " ] \
    && ok "apex AAAA -> GitHub Pages" || wa "apex AAAA: $AAAA"
else
  wa "apex AAAA yok (zorunlu değil)"
fi

W=$(doh www.$DOMAIN CNAME)
[ "$W" = "$PAGES." ] && ok "www CNAME -> $PAGES" || no "www CNAME: ${W:-yok}"

echo "── E-posta (bozulmamalı) ──"
MX=$(doh $DOMAIN MX | wc -l | tr -d ' ')
[ "$MX" -ge 1 ] && ok "$MX MX kaydı duruyor" || no "MX kaydı YOK — e-posta çalışmaz!"

TXT=$(doh $DOMAIN TXT)
SPF=$(echo "$TXT" | grep -c 'v=spf1')
case "$SPF" in
  0) no "SPF kaydı yok" ;;
  1) ok "tek SPF kaydı" ;;
  *) wa "$SPF adet SPF kaydı — RFC 7208 tek olmasını şart koşar, şu an SPF doğrulaması başarısız" ;;
esac
echo "$TXT" | grep -q 'google-site-verification' && ok "Search Console doğrulaması duruyor" || wa "google-site-verification yok"

DKIM=$(doh zoho._domainkey.$DOMAIN TXT)
[ -n "$DKIM" ] && ok "DKIM kaydı duruyor" || wa "DKIM (zoho._domainkey) yok"

DMARC=$(doh _dmarc.$DOMAIN TXT)
if [ -z "$DMARC" ]; then
  wa "DMARC kaydı yok — SPF/DKIM var ama üçüncü ayak eksik"
else
  pol=$(echo "$DMARC" | grep -o 'p=[a-z]*' | head -1 | cut -d= -f2)
  case "$pol" in
    none)       ok "DMARC var (p=none — rapor modu, doğru başlangıç)" ;;
    quarantine) ok "DMARC var (p=quarantine)" ;;
    reject)     ok "DMARC var (p=reject)" ;;
    *)          wa "DMARC var ama politika okunamadı: $DMARC" ;;
  esac
  if [ "$SPF" != "1" ] && [ "$pol" != "none" ]; then
    no "SPF bozukken p=$pol tehlikeli — kendi maillerin engellenebilir"
  fi
fi
echo "$TXT" | grep -q 'zoho-verification' && ok "Zoho doğrulaması duruyor" || wa "zoho-verification yok"

echo "── GitHub Pages ──"
# health uç noktası aralıklı boş dönüyor; birkaç kez dene
H=""
for _ in 1 2 3; do
  H=$(gh api repos/$REPO/pages/health 2>/dev/null)
  echo "$H" | grep -q '"domain"' && break
  sleep 2
done
echo "$H" | python3 -c "
import sys, json, re
try:
    d = json.load(sys.stdin)['domain']
except Exception as e:
    print('  \033[33m!\033[0m health okunamadı:', e); raise SystemExit
p = lambda c, m: print(('  \033[32m✓\033[0m ' if c else '  \033[31m✗\033[0m ') + m)
p(d.get('is_pointed_to_github_pages_ip'), 'Pages IP doğrulandı')
p(d.get('is_served_by_pages'), 'Pages servis ediyor')
p(d.get('is_https_eligible'), 'HTTPS sertifikası uygun')
if not d.get('is_valid'):
    print('    sebep:', re.sub('<[^>]+>', '', d.get(\"reason\") or '-'))
"
gh api repos/$REPO/pages --jq '.https_enforced' 2>/dev/null | grep -q true \
  && ok "Enforce HTTPS açık" || wa "Enforce HTTPS kapalı (sertifika üretilince Settings > Pages'ten aç)"

echo "── HTTP (GitHub IP'sine doğrudan; yerel DNS önbelleğini atlar) ──"
for path in / /essays/ /workbench/ /llms.txt /giscus-light.css \
            /how-buying-an-iphone-helped-me-to-land-my-first-job-as-a-developer; do
  code=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 15 \
         --resolve "$DOMAIN:443:185.199.108.153" "https://$DOMAIN$path")
  [ "$code" = "200" ] && ok "$code  $path" || no "$code  $path"
done

echo "── Kim servis ediyor ──"
body=$(curl -sL --max-time 15 --resolve "$DOMAIN:443:185.199.108.153" "https://$DOMAIN/")
if   [ -z "$body" ];                        then no "yanıt yok"
elif echo "$body" | grep -q "Workbench";    then ok "yeni site servis ediliyor"
elif echo "$body" | grep -q "Hashnode";     then no "hâlâ Hashnode servis ediyor"
else                                             wa "bilinmeyen içerik"
fi
