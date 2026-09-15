#!/usr/bin/env bash
# Cutover doğrulaması. DNS değişikliğinden sonra çalıştır:
#   bash scripts/check-dns.sh
set -uo pipefail

DOMAIN=cmlonder.com
PAGES=cmlonder.github.io
GH_IPS=(185.199.108.153 185.199.109.153 185.199.110.153 185.199.111.153)

ok(){ printf "  \033[32m✓\033[0m %s\n" "$1"; }
no(){ printf "  \033[31m✗\033[0m %s\n" "$1"; }
wa(){ printf "  \033[33m!\033[0m %s\n" "$1"; }

echo "── DNS ──"
A=$(dig +short A $DOMAIN | sort | tr '\n' ' ')
want=$(printf '%s\n' "${GH_IPS[@]}" | sort | tr '\n' ' ')
[ "$A" = "$want" ] && ok "apex A kayıtları GitHub Pages'e işaret ediyor" \
                   || no "apex A: $A  (beklenen: $want)"

AAAA=$(dig +short AAAA $DOMAIN | sort | tr '\n' ' ')
if [ -n "$AAAA" ]; then
  want6="2606:50c0:8000::153 2606:50c0:8001::153 2606:50c0:8002::153 2606:50c0:8003::153 "
  [ "$AAAA" = "$want6" ] && ok "apex AAAA kayıtları GitHub Pages'e işaret ediyor" \
                         || wa "apex AAAA: $AAAA"
else
  wa "apex AAAA yok (zorunlu değil, A kayıtları yeterli)"
fi

W=$(dig +short CNAME www.$DOMAIN)
[ "$W" = "$PAGES." ] && ok "www CNAME -> $PAGES" || no "www CNAME: ${W:-yok} (beklenen: $PAGES.)"

echo "── E-posta (bozulmamalı) ──"
MX=$(dig +short MX $DOMAIN | wc -l | tr -d ' ')
[ "$MX" -ge 1 ] && ok "$MX MX kaydı duruyor" || no "MX kaydı YOK — e-posta çalışmaz!"

SPF=$(dig +short TXT $DOMAIN | grep -c 'v=spf1')
case "$SPF" in
  0) no  "SPF kaydı yok" ;;
  1) ok  "tek SPF kaydı (doğru)" ;;
  *) wa  "$SPF adet SPF kaydı var — RFC gereği tek olmalı, e-posta doğrulaması başarısız olur" ;;
esac

dig +short TXT $DOMAIN | grep -q 'google-site-verification' \
  && ok "Google Search Console doğrulaması duruyor" \
  || wa "google-site-verification TXT kaydı yok — Search Console erişimi kopmuş olabilir"

dig +short TXT $DOMAIN | grep -q 'zoho-verification' \
  && ok "Zoho doğrulaması duruyor" || wa "zoho-verification TXT kaydı yok"

echo "── GitHub Pages ──"
H=$(gh api repos/cmlonder/$PAGES/pages/health 2>/dev/null)
if [ -n "$H" ]; then
  echo "$H" | python3 -c "
import sys, json, re
try:
    d = json.load(sys.stdin)['domain']
except Exception as e:
    print('  \033[33m!\033[0m health yanıtı okunamadı:', e)
    raise SystemExit
p = lambda c, m: print(('  \033[32m✓\033[0m ' if c else '  \033[31m✗\033[0m ') + m)
p(d.get('is_pointed_to_github_pages_ip'), 'GitHub Pages IP doğrulandı')
p(d.get('is_served_by_pages'), 'Pages tarafından servis ediliyor')
p(d.get('is_https_eligible'), 'HTTPS sertifikası uygun')
if not d.get('is_valid'):
    import re
    print('    sebep:', re.sub('<[^>]+>', '', d.get('reason') or '-'))
"
else
  wa "health uç noktası okunamadı (gh yetkisi?)"
fi

echo "── HTTP ──"
for u in "https://$DOMAIN/" "https://www.$DOMAIN/" "https://$DOMAIN/essays/" \
         "https://$DOMAIN/how-buying-an-iphone-helped-me-to-land-my-first-job-as-a-developer" \
         "https://$DOMAIN/llms.txt" "https://$DOMAIN/giscus-light.css"; do
  code=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 15 "$u" 2>/dev/null)
  [ "$code" = "200" ] && ok "$code  $u" || no "$code  $u"
done

echo "── Kim servis ediyor ──"
body=$(curl -sL --max-time 15 "https://$DOMAIN/" 2>/dev/null)
if [ -z "$body" ]; then
  no "alan adı yanıt vermiyor — henüz kimse servis etmiyor"
elif echo "$body" | grep -q "Workbench"; then
  ok "yeni site servis ediliyor"
elif echo "$body" | grep -q "Hashnode"; then
  no "hâlâ Hashnode servis ediyor"
else
  wa "bilinmeyen içerik servis ediliyor"
fi
