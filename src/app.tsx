import { Box, Card, Container, Text } from '@chakra-ui/react';
import { ErrorBoundary } from '@/components/error-boundary'
import { logger } from '@/utils/logger';
import { useApi } from '@/hooks/use-api';
import { useEffect, useReducer } from 'react'

const initialState = {
  message: ''
};

const reducer = (data, partialData) => ({
  ...data,
  ...partialData,
});

const App = () => {

  return (
    <Container>
      <ErrorBoundary>
        <RespuestaServicio />
      </ErrorBoundary>
    </Container>
  );
}

const RespuestaServicio = () => {
  const { getData, loading, error } = useApi();
  const [data, updateData] = useReducer(reducer, initialState);
  const { message } = data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData('/api/hello');
        updateData({message: response.data});
        logger.info('Successfully fetched data', { data: response.data });
      } catch (err) {
        logger.error('Failed to fetch data', { error: err.message });
      }
    };

    fetchData();
  }, [getData]);

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Respuesta del servicio</Card.Title>
      </Card.Header>
      <Card.Body>
        {loading && <Box>Loading...</Box>}
        {error && <Box>{error}</Box>}
        {message && <Box>{message}</Box>}
        <Text>{loading ? 'Cargando...' : message}</Text>
      </Card.Body>
    </Card.Root>
  );
};

export default App
