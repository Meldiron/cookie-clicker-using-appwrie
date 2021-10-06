<p align="center"><a href="https://appwrite.io/" alt="Built with Appwrite"><img src="https://appwrite.io/images-ee/press/badge-pink-button.svg" height="80"></a></p>



# CookieClicker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.0.

## Appwrite setup

**Currently, the setup is not fully docummented.**

You need to create a project and define these collections:

### Collections

**profiles**

```
{
    "$id": "612fa28bd85c2",
    "$permissions": {
        "read": [
            "*"
        ],
        "write": [
            "*"
        ]
    },
    "name": "profiles",
    "dateCreated": 1630511755,
    "dateUpdated": 1630512498,
    "rules": [
        {
            "$id": "612fa4dfd8f6e",
            "$collection": "rules",
            "type": "text",
            "key": "userId",
            "label": "userId",
            "default": "",
            "array": false,
            "required": true,
            "list": []
        },
        {
            "$id": "612fa4dfdb996",
            "$collection": "rules",
            "type": "text",
            "key": "username",
            "label": "username",
            "default": "",
            "array": false,
            "required": true,
            "list": []
        },
        {
            "$id": "612fa5728515b",
            "$collection": "rules",
            "type": "numeric",
            "key": "clicks",
            "label": "clicks",
            "default": 0,
            "array": false,
            "required": true,
            "list": []
        }
    ]
}
```

**averages**

```
{
    "$id": "6131b30f7b613",
    "$permissions": {
        "read": [
            "role:member"
        ],
        "write": []
    },
    "name": "averages",
    "dateCreated": 1630647055,
    "dateUpdated": 1630647081,
    "rules": [
        {
            "$id": "6131b32976319",
            "$collection": "rules",
            "type": "numeric",
            "key": "averageClicks",
            "label": "averageClicks",
            "default": 0,
            "array": false,
            "required": false,
            "list": []
        },
        {
            "$id": "6131b329791a5",
            "$collection": "rules",
            "type": "numeric",
            "key": "timeAt",
            "label": "timeAt",
            "default": 0,
            "array": false,
            "required": false,
            "list": []
        }
    ]
}
```

### Functions

**calculateAverage**

```
{
    "$id": "6131b3c4e282a",
    "$permissions": {
        "execute": []
    },
    "name": "calculateAverage",
    "dateCreated": 1630647236,
    "dateUpdated": 1630647450,
    "status": "disabled",
    "runtime": "php-8.0",
    "tag": "",
    "vars": {
        "APPWRITE_API_KEY": "########",
        "APPWRITE_ENDPOINT": "########"
    },
    "events": [],
    "schedule": "0 * * * *",
    "scheduleNext": 0,
    "schedulePrevious": 0,
    "timeout": 60
}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
