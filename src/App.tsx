import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper'
import configureFakeBackend from './helpers/fake-backend'
import AppRouter from './routes/router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  ReactQueryDevtools
} from '@tanstack/react-query-devtools'

import '@/assets/scss/app.scss'



//configureFakeBackend()

const queryClient = new QueryClient()

const App = () => {
  return (
    <AppProvidersWrapper>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ReactQueryDevtools  />

      </QueryClientProvider>
    </AppProvidersWrapper>
  )
}

export default App

