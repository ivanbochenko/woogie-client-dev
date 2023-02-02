import { createClient, defaultExchanges, subscriptionExchange } from 'urql'
import axios from 'axios'
import RNEventSource from 'react-native-event-source'
import { baseURL } from 'constants/Keys'

const gqlUrl = baseURL + '/graphql'
const timeout = 10000

export const apiClient = (token) => axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
    "Authorization": token ?? '',
  }
})

export const gqlClient = (token) => createClient({
  url: gqlUrl,
  fetchOptions: () => {
    return {
      headers: { Authorization: token }
    };
  },
  url: gqlUrl,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        const url = new URL(gqlUrl)
        url.searchParams.append('query', operation.query)
        if (operation.variables) {
          url.searchParams.append(
            'variables',
            JSON.stringify(operation.variables),
          )
        }
        return {
          subscribe: (sink) => {
            const eventsource = new RNEventSource(url.toString(), {
              headers: { Authorization: token }
            })
            eventsource.addEventListener('message', (event) => {
              const data = JSON.parse(event.data)
              sink.next(data)
              if (eventsource.readyState === 2) {
                sink.complete()
              }
            })
            eventsource.addEventListener('error', (error) => {
              sink.error(error)
            })
            return {
              unsubscribe: () => {
                eventsource.removeAllListeners();
                eventsource.close();
              },
            }
          },
        }
      },
    }),
  ],
})