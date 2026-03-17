export function createDataBySchema(schema: any) {
  const { properties = {} } = schema
  const typeMapping: Record<string, any> = {
    string: '',
    number: 0,
    array: [],
    boolean: false,
    date: '',
    object: {},
  }
  return Object.fromEntries(
    Object.entries(properties).map(([key, field]: [string, any]) => [
      key,
      typeMapping[field.type ?? ''] ?? '',
    ]),
  )
}
