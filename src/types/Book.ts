export interface BookCardType {
    id: string;
    volumeInfo: {
      title: string;
      authors: string[];
      imageLinks: {
        thumbnail: string;
      };
    };
  };


export interface BookListType {
  books: BookCardType[];
}
