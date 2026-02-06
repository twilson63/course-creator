import { open, Dbi } from "lmdb";

export const db = open({
  path: "./data/courses.mdb",
  // 1 GiB – more than enough for a handful of courses
  maxSize: 1 * 1024 * 1024 * 1024,
});

export const Courses: Dbi<string> = db.openDbi({
  name: "courses",
  keyEncoding: "string",
});

export const HtmlCache: Dbi<string> = db.openDbi({
  name: "html",
  keyEncoding: "string",
});
