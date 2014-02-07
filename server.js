#!/usr/bin/env node

// # Substripe

var _ = require('underscore')
var path = require('path')
var fs = require('fs')
var accounting = require('accounting')

// setup config
var config = {
  sk: process.env.SK,
  pk: process.env.PK,
  port: 3000,
  public: path.join(__dirname, 'public')
}

// convert port to a number if it's set
if (_.isString(process.env.PORT))
  config.port = parseInt(process.env.PORT, 10)

// check that the path exists if it is set
if (_.isString(process.env.PUBLIC) && !fs.existsSync(process.env.PUBLIC))
  throw new Error('Path specified for public directory for serving assets does not exist')

// validate secret key
if (!_.isString(config.sk))
  throw new Error("Stripe's secret key `SK` environment variable missing")

// validate public key
if (!_.isString(config.pk))
  throw new Error("Stripe's public key `PK` environment variable missing")

// validate port
if (!_.isNumber(config.port))
  throw new Error("Port was not a valid number, default (blank) is 3000")

// setup stripe with secret key
var stripe = require('stripe')(config.sk)
var multipart = require('connect-multiparty')

// setup server
var express = require('express')
var app = express()

// configure server
app.configure(function() {
  app.use(express.logger())
  app.use(express.favicon(path.join(config.public, 'favicon.ico')))
  app.use(express.json())
  app.use(express.urlencoded())
  app.use(express.methodOverride())
  app.set('view engine', 'jade')
  app.set('views', __dirname)
  app.locals.pretty = true
  app.locals.config = config
  app.use(app.router)
})

app.configure('production', function() {
  app.enable('view cache')
  app.use(express.compress())
})

app.use(function(req, res, next) {
  res.locals.req = req
  next()
})

// home page
app.get('/', function(req, res) {
  res.render('')
})

// read subscription
app.get('/plan/:stripe_plan_id', getAccount, getPlan, function(req, res, next) {
  _.defaults(res.locals, {
    data: {
      image: '/substripe.png',
      name: res.locals.account.display_name,
      description: 'Subscribe to ' + res.locals.plan.name,
      amount: res.locals.plan.amount,
      currency: 'usd',
      panel_label: 'Subscribe @ ' + accounting.formatMoney(res.locals.plan.amount / 100) + '/' + interval(res.locals.plan.interval),
      billing_address: false,
      shipping_address: false,
      email: '',
      label: 'Subscribe @ ' + accounting.formatMoney(res.locals.plan.amount / 100) + '/' + interval(res.locals.plan.interval)
    }
  })
  _.extend(res.locals.data, req.query)
  res.render('plan')
})

// create subscription
app.post('/plan/:stripe_plan_id', multipart(), getAccount, getPlan, function(req, res, next) {
  if (!_.isString(req.body.stripeToken))
    return next(new Error('stripeToken is missing'))
  if (!_.isString(req.body.stripeEmail))
    return next(new Error('stripeEmail is missing'))
  stripe.customers.create({
    description: 'Substripe subscription for ' + req.body.stripeEmail,
    card: req.body.stripeToken,
    email: req.body.stripeEmail
  }, createCustomer)

  function createCustomer(err, customer) {
    if (err) return next(err)
    stripe.customers.createSubscription(customer.id, {
      plan: res.locals.plan.id
    }, createSubscription)
  }

  function createSubscription(err, subscription) {
    if (err) return next(err)
    res.locals.subscription = subscription
    res.render('subscription')
  }

})

// helper function to reduce length of interval string
function interval(plan_interval) {
  switch(plan_interval) {
  case 'week':
    return 'wk'
  case 'month':
    return 'mo'
  case 'year':
    return 'yr'
  }
}

// helper function to get stripe account
function getAccount(req, res, next) {
  stripe.account.retrieve(function(err, account) {
    if (err) return next(err)
    res.locals.account = account
    next()
  })
}

// helper function to validate stripe_plan_id param
function getPlan(req, res, next) {
  if (!_.isString(req.params.stripe_plan_id))
    return next(new Error('No `stripe_plan_id` was found in req.params'))
  stripe.plans.retrieve(req.params.stripe_plan_id, function(err, plan) {
    if (err) return next(err)
    res.locals.plan = plan
    next()
  })
}

// handle errors
app.use(function(err, req, res, next) {
  console.error(err)
  res.format({
    text: function() {
      res.send(err.message)
    },
    html: function() {
      res.render('error', { err: err })
    },
    json: function() {
      res.send({ error: err.message })
    }
  })
})

app.use(express.static(path.resolve(config.public)))

app.use(app.router)

app.listen(config.port, function() {
  console.log('server started on port %d', config.port)
})
