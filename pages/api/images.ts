import { NextApiRequest, NextApiResponse } from 'next';
import withApiMiddleware from '../../utils/middlewares/withApiMiddleware';

type RequestQuery = Record<string, string>;

async function getFetchURL(requestQuery: RequestQuery): Promise<URL> {
  const { API_ENDPOINT } = process.env;
  const endpointName = '/v1/' + requestQuery.e;

  const endpointURL = new URL(endpointName, API_ENDPOINT);
  if (endpointName.includes('photos')) return endpointURL;

  endpointURL.searchParams.set('page', requestQuery.p || '1');
  endpointURL.searchParams.set('per_page', '24');

  const orientation = requestQuery.o || 'all';

  if (endpointName.includes('search'))
    endpointURL.searchParams.set('query', requestQuery.q);

  if (orientation != 'all')
    endpointURL.searchParams.set('orientation', requestQuery.o);

  return endpointURL;
}

export default withApiMiddleware(
  async (request: NextApiRequest, response: NextApiResponse) => {
    const API_KEY = process.env.API_KEY as string;

    const fetchURL = await getFetchURL(request.query as RequestQuery);
    const options = {
      method: 'GET',
      headers: {
        Authorization: API_KEY
      }
    };

    try {
      const res = await fetch(fetchURL, options);
      const data = await res.json();

      response.status(200).json(data);
    } catch (error) {
      response.status(500).json(error);
    }
  }
);
