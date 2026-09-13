# Agewise

React/Vite age calculator: [tensai-calculator.netlify.app](https://tensai-calculator.netlify.app/)

## API

`GET /api/age?dob=YYYY-MM-DD`

Example: `https://tensai-calculator.netlify.app/api/age?dob=2008-08-15`

The response uses the same calculator logic and fields as the website:

```json
{"years":18,"months":0,"days":29,"hours":0,"minutes":0,"seconds":0,"totalMs":568512000000}
```

`dob` must be a real, non-future Gregorian date in `YYYY-MM-DD` format. Invalid input returns HTTP `400`:

```json
{"error":"Invalid date of birth"}
```

Other methods return HTTP `405` with `{"error":"Method not allowed"}`. CORS is enabled for Discord bots. The bot can make this GET request with its HTTP client, parse the JSON, and reply with `years`, `months`, and `days`.

## Local verification

```bash
npm install
npm run dev
```

Open `http://localhost:5000` and call the local API with:

```text
http://localhost:5000/api/age?dob=2008-08-15
```

For a production build:

```bash
npm run check
npm run build
npm run start
```
