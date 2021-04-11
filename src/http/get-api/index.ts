import { sum } from '@architect/shared/sum';

// learn more about HTTP functions here: https://arc.codes/primitives/http
export async function handler (req) {
  console.log('sum', sum(1, 2));
  return {
    statusCode: 200,
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json; charset=utf8'
    },
    body: JSON.stringify({
      fruits: ['apple', 'banana', 'grapes']
    })
  }
}