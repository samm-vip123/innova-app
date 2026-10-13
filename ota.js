export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { ticket } = req.query || {};
  if (!ticket) return res.status(400).send('Missing ticket');

  const APP_URL = process.env.APP_IPA_URL || 'https://your-domain.vercel.app/app.ipa';

  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${APP_URL}</string>
        </dict>
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>com.innova.cheat</string>
        <key>bundle-version</key>
        <string>2.1.2</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>INNOVA CHEAT</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(plist);
}
