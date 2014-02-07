
# Substripe [![NPM version](https://badge.fury.io/js/substripe.png)](http://badge.fury.io/js/substripe) [![Gittip](http://img.shields.io/gittip/niftylettuce.png)](https://www.gittip.com/niftylettuce/)

**WORK IN PROGRESS, NOT READY YET, CHECK BACK IN A FEW HOURS**

Extremely simple subscription payment form with Stripe in seconds.

Great for charging {{someone}} for a monthly subscription to {{something}}.

Try out the demo at <http://substripe.com/demo> (enter credit card 4242-4242-4242-4242 with any valid exp date and any CVC).

## Quick Start


1. Create a new Stripe subscription plan at <https://manage.stripe.com/plans> (create identical plans in both Live and Test mode).

2. Install `substripe` as a global module.
```bash
npm install -g substripe
```

3. Spin up a server in either development or production mode (see below).

## Development Mode

```bash
PORT=3000 SK=stripe-test-sk PK=stripe-test-pk
```

<http://localhost:3000/{{stripe_plan_id}}>

## Production Mode

Register a domain name and an SSL certificate (e.g. PositiveSSL or RapidSSL) at [Namecheap](http://www.namecheap.com/?aff=34556) (affiliate link, you can use coupon "DOMAINZZ" as of Feb 7, 2014 to save some bones).

Port is automatically set to 443 (https protocol) in production mode (as required by Stripe), so you don't need to pass `PORT` environment variable like in development mode (see above).

```bash
NODE_ENV=production SK=stripe-live-sk PK=stripe-live-pk substripe
```

<https://yourdomain.com/{{stripe_plan_id}}>
