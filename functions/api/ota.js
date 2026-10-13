export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const ticket = url.searchParams.get('ticket');

  if (!ticket) {
    return new Response('Missing ticket', { status: 400 });
  }

  const APP_URL = 'https://your-domain.pages.dev/app.ipa';

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>items</key><array><dict>
<key>assets</key><array><dict>
<key>kind</key><string>software-package</string>
<key>url</key><string>${APP_URL}</string>
</dict></array>
<key>metadata</key><dict>
<bundle-identifier</bundle-identifier>
<key>bundle-identifier</key><string>com.innova.cheat</string>
<key>bundle-version</key><string>2.1.2</string>
<key>kind</key><string>software</string>
<key>title</key><string>INNOVA CHEAT</string>
</dict>
</dict></array>
</dict></plist>`;

  return new Response(plist, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
