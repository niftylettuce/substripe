
# Substripe [![NPM version](https://badge.fury.io/js/substripe.png)](http://badge.fury.io/js/substripe) [![Gittip](http://img.shields.io/gittip/niftylettuce.png)](https://www.gittip.com/niftylettuce/)

![Substripe](https://raw2.github.com/niftylettuce/substripe/master/public/substripe.png)

Extremely simple subscription payment form with Stripe in seconds.

Great for charging {{someone}} for a monthly subscription to {{something}}.

Try out the demo at <http://substripe.com:3000/plan/demo> (enter credit card 4242-4242-4242-4242 with any valid exp date and any CVC).

> View this documentation at <http://documentup.com/niftylettuce/substripe>.


## Quick Start

* Create a new Stripe subscription plan at <https://manage.stripe.com/plans> (create identical plans in both Live and Test mode).
* Configure Stripe to automatically [send emails upon successful payments](https://manage.stripe.com/account/emails).
* Install `substripe` as a global module with NPM:
```bash
npm install -g substripe
```
* Spin up a server in either development or production mode (see below).

### Environment Variables

Here are the following environment variables and their default values.

| Environment Variable | Default Value   | Description
| -------------------- | --------------- | -----------
| SK                   | None (required) | Stripe secret key
| PK                   | None (required) | Stripe public key
| PUBLIC               | `./`            | Path to public directory for serving assets (e.g. Stripe Checkout image, see below [Tricks](#tricks))
| PORT                 | 3000            | Port to run substripe server on
| NODE_ENV             | development (if value is "production", then PORT is set to 443) | Node.js environment (either "development" or "production")
| KEY                  | None (required in production) | Path to SSL key
| CERT                 | None (required in production) | Path to SSL cert

### Development Mode

```bash
PUBLIC=./ PORT=3000 SK=stripe-test-sk PK=stripe-test-pk
```

<http://localhost:3000/plan/{{stripe_plan_id}}>

### Production Mode

Register a domain name and an SSL certificate (e.g. PositiveSSL or RapidSSL) at [Namecheap](http://www.namecheap.com/?aff=34556) (affiliate link, you can use coupon "DOMAINZZ" as of Feb 7, 2014 to save some bones).

Port is automatically set to 443 (https protocol) in production mode (as required by Stripe), so you don't need to pass `PORT` environment variable like in development mode (see above).

You need to pass a valid path to the SSL certificate's key and cert files as well.

```bash
NODE_ENV=production KEY=./key.pem CERT=./cert.pem PUBLIC=./ SK=stripe-live-sk PK=stripe-live-pk substripe
```

<https://yourdomain.com/plan/{{stripe_plan_id}}>


## Tricks

You can add the following options as querystring parameters to pre-populate the Stripe checkout form.  These options are the same the [Configuration Options](https://stripe.com/docs/checkout#integration-simple-options) from Stripe.

> (e.g. pre-populate an image and an email address of the customer <https://yourdomain.com/{{stripe_plan_id}}?image=%2Fsubstripe.png&email=niftylettuce@gmail.com>)

| Param            | Default Value
| ---------------- | --------------
| image            | "/substripe.png"
| name             | [display name]
| description      | "Subscribe to {{plan.name}}"
| amount           | {{plan.amount}} (cents)
| currency         | "usd"
| panel_label      | "Subscribe @ ${{plan.amount}}/{{plan.interval}}"
| billing_address  | false
| shipping_address | false
| email            | ""
| label            | "Subscribe @ ${{plan.amount}}/{{plan.interval}}"

**NOTE**: Default value's for `panel_label` and `label` have the values of {{plan.interval}} abbreviated (e.g. "week" => "wk", "month" => "mo", "year" => "yr").

[display name]: https://stripe.com/docs/api/node#retrieve_account

## License

The MIT License

Copyright (c) 2014- Nick Baugh niftylettuce@gmail.com (http://niftylettuce.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
