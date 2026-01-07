// Mock superjson for testing
export default {
  serialize: (data: any) => ({ json: data, meta: undefined }),
  deserialize: (data: any) => data.json || data,
  stringify: (data: any) => JSON.stringify(data),
  parse: (data: string) => JSON.parse(data),
};

