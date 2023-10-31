export type UnknownObject = { [key: string]: unknown };
export type Query<DocumentType = any> = UnknownObject | Array<DocumentType>;  //string | Array<unknown> | UnknownObject;