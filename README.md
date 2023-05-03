# env-url-shortener
URL shortener written in Node.js. App is generating routes by variables in .ENV. Simple and powerful. No databse, no json files, just env.

## How to use
1. Clone repository: `git clone https://github.com/mativizo/env-url-shortener`.
2. Install dependencies: `npm i`.
2. Set your urls in env.
3. Run `npm start`.


### How to add urls to .env?

Simply, use:
```
URL_<unique_name>_ID=slug_here
URL_<unique_name>_GO=url_here.com
```

For example:
```
URL_1_ID=yt
URL_1_GO=youtube.com
URL_2_ID=google
URL_2_GO=google.com
URL_3_ID=gh
URL_3_GO=https://github.com
```
127.0.0.1:3000/yt -> https://youtube.com
127.0.0.1:3000/google -> https://google.com
127.0.0.1:3000/gh -> https://github.com

### How to change prefix?

To change variables prefix (`URL_` by default), set `VAR_PREFIX` variable in env:
```
VAR_PREFIX=X_
X_1_ID=yt
X_1_GO=youtube.com
X_2_ID=google
X_2_GO=google.com
X_3_ID=gh
X_3_GO=https://github.com
```