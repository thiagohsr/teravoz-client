[![CircleCI](https://circleci.com/gh/thiagohsr/teravoz-client/tree/master.svg?style=svg)](https://circleci.com/gh/thiagohsr/teravoz-client/tree/master)

# Code Challenge Teravoz (fullstack)

App developed to fulfill requirements on [fullstack challenge](https://github.com/teravoz/challenge/blob/master/full-stack/README.md).

## Dependencies

- Nodejs v10.12.0 [NVM](https://github.com/creationix/nvm#installation)
- Docker [Install overview and guides](https://docs.docker.com/install/overview/). (it's not obligatory)

## How to run the app

### Setup

1.  After clone repo, inside root directory, execute: `make setup`

2.  If you have docker installed, you can use `make docker-build` and after build concluded run `make docker-run`.

    - If you prefer to run without docker, execute with `make production`.

3.  For development purposes, is better run with `make dev`. Because it do more hot reload modules and restarts if you need to modify some code.

4.  When the application starts, you have three available addressess:

    - Client to redirect posts on `http://localhost:3002/webhook/`.

         - This will handle data send with POST method, savied the caller number inside data, if it's a number that's not found in customer list and redirect to an agent in queue 900. Because that caracterize a new customer.

         - If receive payload with a number that's already exists, will only get the caller number from data payload, and update a agent on queue 901 with this informations.


    - Front end dashboard to see what agents already in call and the caller number. `http://localhost:5000/`. When you update the data in webhook endpoint, have to reload the page to see the agents status change. In a future i pretend to implement io.socket to see in realtime.


    - The data schemas are available in `http://localhost:3000`.

         - This is a awesome npm package (json-server), whos serves a json file like and API. If you want to reset the callers, or add more queues, or agents, simply edit the `db.json` file, and when save, it's ready to work.

### Running Tests

- On app root, run: `make test`.

- Use `make lint` in development time, to help check some typos, syntax and other code quality rules with

## Extras:

### Help hand to test app behavior.

- Here are some call samples, to test the API:
  With this cURL, and some change in `their_number` propertie, you will easy verify the calls redirections.

  ```javascript
      curl -X POST \
      http://localhost:3002/webhook/ \
      -H 'Content-Type: application/json' \
      -d '{
          "type": "call.standby",
          "call_id": "7f46c734-ffa5-447d-b08b-8709017b9d42",
          "code": "123456",
          "direction": "inbound",
          "our_number": "0800000000",
          "their_number": "11999921329",
          "their_number_type": "mobile",
          "timestamp": "1539855333"
      }'
  ```

### Other tasks answers:

#### Proud of:

   - I really have proud to participate and write the pieces of code for this challenge. It's represents a great meaninful and aggregate value to my developer background. Because it's my first "under pressure" nodejs development. My learn curve with docker is a gratitude and happiness to share too.

#### Ashamed of:

   - One of shame piece of code on this challenge, the [delegateCallApi](https://github.com/thiagohsr/teravoz-client/blob/master/api/client.js#L62), is a decision that i recognize it's not a good idea, the single responsability and separation of concerns are violently unrespected. I expect resolve it better and smart with some more analysis.

#### Feedback:

   - **What do you think about this challenge?**
        In software programming carreer, i think, is like any other exercise. The more we pratice, make mistakes and learn from them, at least we should. It's a perspective from a interviewed.

        From interviewer perspective, would be a better manner to verify if knowledge degree of possible job partner fit with he's perspectives? I guess no.


   - **Is this a nice and reliable way of assessing your skills?** I believe it is. And too, to measure the self organization, thought manner and others behaviors, that i do not have a better comprehension to share.

   - **Would you think of another way?** No.

   - **Would you make it better?** well, i see in others process the use of code platforms with some challenges presets and knowed algorithms for his difficult. And i believe it's a good way to analyse candidates.
    But i need to speech, i prefer the manner of this challenge. It's no bullshit.
