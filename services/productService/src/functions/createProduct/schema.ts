export default {
  type: "object",
  properties: {
    title: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    price: {
      type: 'number'
    }
  },
  required: ['title', 'price', 'description']
} as const;
