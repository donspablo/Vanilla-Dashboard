
![image](https://user-images.githubusercontent.com/6468571/152601370-fd51c475-8f32-46a4-83d2-44f77cecd376.png)

# The Vanilla Dashboard Project

🍦 The Vanilla Dashboard is a Vanilla JavaScript dashboard that connects to a.txt file-based database through PHP.
Vanilla Dashboard is free and open source software.

The Vanilla Dashboard is a free and open-source project, and comes with Vanilla, "Live Chat," and "Who Is Online"
services baked in, as well as a variety of "Easter Eggs," all wrapped up in a Vanilla CSS UI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/donPabloNow/Vanilla-Dashboard) [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://www.heroku.com/deploy/?template=https://gitpod.io/#https://github.com/donPabloNow/Vanilla-Dashboard) [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/donPabloNow/Vanilla-Dashboard) [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/donPabloNow/Vanilla-Dashboard) 

## Content Index

- [Road Map](#Road-Map)
- [Installation](#Installation-Instructions)
- [Usage & How to Guide](#Usage-&-How-to-Guide)
- [Contributing to the Project](#Contributing-to-the-Project)
- [Licensing and Ownership](#Licensing-and-Ownership)
![image](https://user-images.githubusercontent.com/6468571/152601481-d3792aa4-7f82-4bc5-9b8d-1ad77f66faf5.png)

# Screenshots

<p align="center">

![image](img/screenshot.jpg)

</p>

## Road Map

- [x] Foundation
    - [x] API Service
    - [x] TxT DB
    - [x] Login
    - [x] Registration
    - [x] Dashboard
    - [x] Who is Online
    - [x] Documentation
- [ ] Tables
    - [x] Users
    - [x] Notes
    - [x] Tasks
    - [ ] Chat
- [ ] Notes
    - [x] Data Scheme
    - [x] API Endpoints
    - [x] Functions
    - [ ] UI
- [ ] Tasks
    - [x] Data Scheme
    - [x] API Endpoints
    - [x] Functions
    - [ ] UI
- [ ] Chat
    - [ ] Data Scheme
    - [x] API Endpoints
    - [x] Functions
    - [ ] UI
- [ ] Testing
    - [x] Versions
    - [x] Owners
    - [ ] Crate details

![image](https://user-images.githubusercontent.com/6468571/152181888-0b505d28-41c9-4d17-bf4d-9cb3b3411e67.png)

![image](https://user-images.githubusercontent.com/6468571/152180986-20e0beb1-c098-421b-b71a-e8cfc01aa170.png)

## Installation Instructions

# Lando

You may either "plug and play" on PHP-compatible machines or build in a LAMP environment using the project's LAMP recipe
for Lando - A Liberating Dev Tool For All Your Projects, which can be found here. If you want to learn more about the
project, check out the FAQ. The use of local development and DevOps technologies by professional developers is
widespread around the globe, while it is most prominent in the United States. Release oneself from the mental
restrictions imposed by inadequate software for development. You may be able to save time, money, and frustration if you
concentrate your efforts on the most important tasks.

![image](https://user-images.githubusercontent.com/6468571/152177774-25482b2a-f8cd-4f19-a221-97dc29212a2d.png)

Clone this repo

```

git clone https://github.com/donPabloNow/vanilla-dashboard

```

Clone the "sample.env" to ".env" and update with the correct details.

```
cp ./sample.env ./.env
```

Host the files on a PHP server

```
# Start it up
lando start

# List information about this app.
lando info
```

or

```
# Initialize a lamp recipe using the latest codeigniter version
lando init \
  --source remote \
  --remote-url https://github.com/bcit-ci/CodeIgniter/archive/3.1.10.tar.gz \
  --remote-options="--strip-components 1" \
  --recipe lamp \
  --webroot . \
  --name my-first-lamp-app
```

For more information please see: https://docs.lando.dev/config/lamp.html

![image](https://user-images.githubusercontent.com/6468571/152178164-3cf9d286-6ca2-407e-8f62-50fc4d217a6b.png)

![image](https://user-images.githubusercontent.com/6468571/152181962-33e4e658-5fbc-4b2d-9366-7147e9fabe65.png)

# Gitpod

Gitpod is an open-source Kubernetes tool for quickly establishing code-ready development environments. It produces
fresh, automated development environments in the cloud for each work utilising cloud-based technologies. And it does all
of this in the cloud. It enables you to declare your development environment in code, as well as to launch immediate,
remote, and cloud-based development environments directly from your browser or desktop integrated development
environment.

https://gitpod.com/#https://github.com/donPabloNow/vanilla-dashboard

![image](https://user-images.githubusercontent.com/6468571/152177615-421c1286-33cd-4c38-9f7b-3c486901ba81.png)

![image](https://user-images.githubusercontent.com/6468571/152181058-6446dd76-3012-4e9f-b05a-7d86ca5d0872.png)

## Usage & How to Guide

Navigate to the root of the project with your browser, register an account and then login.

![image](https://user-images.githubusercontent.com/6468571/152178601-981f8e64-a22e-4278-89dd-46e2c39ee77f.png)

![image](https://user-images.githubusercontent.com/6468571/152181949-99b9aaa6-586e-4f64-826d-ec7616535d1c.png)

![image](https://user-images.githubusercontent.com/6468571/152181096-2b8db6ac-337c-48be-849b-4bca24e4a39b.png)

## Contributing to the Project

Pull requests are evaluated and approved by the development team. If you want to talk about the changes you want to
make, please create a new issue for that purpose. If possible, please ensure that tests are updated on a regular basis
in order to avoid misconceptions.

![image](https://user-images.githubusercontent.com/6468571/152181932-88f8e56c-b479-478a-8e38-06150cf4ef3e.png)

![image](https://user-images.githubusercontent.com/6468571/152178640-266dfe32-62c2-4ad2-a2c9-2096af248e18.png)

![image](https://user-images.githubusercontent.com/6468571/152181962-33e4e658-5fbc-4b2d-9366-7147e9fabe65.png)

## Licensing and Ownership

[MIT](https://choosealicense.com/licenses/mit/)

![image](https://user-images.githubusercontent.com/6468571/152601521-14070390-49c9-48eb-b35e-4a0372b3b416.png)

