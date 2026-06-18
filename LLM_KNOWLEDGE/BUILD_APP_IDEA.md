# INVOICE CREATOR

## Basic Functionality 

I want to create an app where I can create invoices easily for multiple clients, these invoices should come out in the form of PDF that I can easily print
I want to have two ways to do this which is creating a client, then creating a payperiod for that client.  Once that pay period is up we then archive it just for later use
We can also track different metrics on the dashboards off of these as well.  The pay periods should have multiple collumns, one for date, riders (Number), AM/PM, Extras (Number), Notes (VARCHAR)
For creating the invoices we want to go through all the dates show the price, and then any notes for.  On the top of the invoice it should have the client name, and then something that we can configure
We should also be able to set how much we are charging for rides.  

## Dashboard

Should just diplay whatever information that you think would be good for this type of app, with a way to get to the client page

## Client Page

List all of the clients and then a kebab menu on each clients box so that we can access the settings for them.

## Client id page

Should list all the pay periods, and then also setting up a new pay period, also a way to get to the settings for the client

## Pay period

Way to add information to the pay period, basically adding a row.  Then a way to export it to an PDF.

## Invoices

The invoices should go like this (Riders * Rate) + extras  then when listed it says 1. Riders 3 2. Extra $20 (with notes) 3. Total

## Stack

We want this to be fairly light weight, but we will be using NextJS, Shadcn, and using a SQLite database. 
