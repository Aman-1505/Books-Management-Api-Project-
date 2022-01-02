const express = require("express");
var bodyParser = require("body-parser");
const database = require("./database");
const req = require("express/lib/request");

const booky = express();


booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());



/*
Route          /
Description    Get all the books
Access         Public
Parameter      None
Methods        get
*/

booky.get("/",(req,res) =>{
    return res.json({books: database.books});
});


/*
Route          /is
Description    Get specific books on ISBN
Access         Public
Parameter      ISBN
Methods        get
*/
booky.get("/is/:isbn",(req,res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook});
});


    /*
Route          /c
Description    Get specific category of books on
Access         Public
Parameter      category
Methods        get
*/
booky.get("/c/:category",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category));

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.category}`});
    }
    return res.json({book: getSpecificBook});
});

/*
Route          /l
Description    Get specific books on Language
Access         Public
Parameter      language
Methods        get
*/
booky.get("/l/:language",(req,res) => {
    const getSpecificBook = database.books.filter((book) => book.language.includes(req.params.language));

    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.language}`});
    }
    return res.json({book: getSpecificBook});
});


/*
Route          /author
Description    get all the author
Access         Public
Parameter      none
Methods        get
*/

booky.get("/author",(req,res) => {
    return res.json({author: database.author})
})


/*
Route          /author
Description    get the specific author
Access         Public
Parameter      Name
Methods        get
*/

booky.get("/author/:Name", (req,res) => {
    const getSpecificAuthor = database.author.filter((Name) => Name.name === req.params.Name);
    if(getSpecificAuthor.length === 0)
    {
        return res.json({error: `Author name is not found for ${req.params.Name}` });
    }
    return res.json({Name: getSpecificAuthor});
})


/*
Route          /author/book
Description    get all the author based on the books
Access         Public
Parameter      isbn
Methods        get
*/

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter((author) => author.books.includes(req.params.isbn));
    if(getSpecificAuthor.length === 0){
        return res.json({error: `Author based on books is not found for ${req.params.isbn}`});
    }

    return res.json({author: getSpecificAuthor});
})


/*
Route          /publication
Description    get all the publication
Access         Public
Parameter      none
Methods        get
*/

booky.get("/publication",(req,res) => {
    return res.json({publication: database.publication});
}) 


/*
Route          /publication
Description    get the Specific publication
Access         Public
Parameter      Name
Methods        get
*/

booky.get("/publication/:Name",(req,res) => {
    const getSpecificPublication = database.publication.filter((publicationName) => publicationName.name === req.params.Name);
    if(getSpecificPublication.length === 0) 
    {
        return res.json({error: `Pulication is not found for ${req.params.Name}`});
    }
    return res.json({publication: getSpecificPublication});
})


/*
Route          /publication/books
Description    get the publication based on books
Access         Public
Parameter      isbn
Methods        get
*/

booky.get("/publication/book/:isbn",(req,res) => {
    const getSpecificPublication = database.publication.filter((publicationBook) =>  publicationBook.books.includes(req.params.isbn));
    if(getSpecificPublication.length === 0)
    {
        return res.json({error: `Publication based on books is not found for ${req.params.isbn}`});
    }
    return res.json({publicationBook: getSpecificPublication});
})

/*
Route          /books/new
Description    post the books(add new book)
Access         Public
Parameter      none
Methods        post
*/

booky.post("/book/new",(req,res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});



/*
Route          /author/new
Description     add the new author
Access         Public
Parameter      none
Methods        post
*/

booky.post("/author/new",(req,res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthor: database.author});
});


/*
Route          /publication/new
Description     add the publication
Access         Public
Parameter      none
Methods        post
*/

booky.post("/publication/new",(req,res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatedPublication: database.publication});
});

/*
Route          /publication/update/book/:isnn
Description     update/ add the publication
Access         Public
Parameter      isbn
Methods        put
*/

booky.put("/publication/update/book/:isbn",(req,res) =>{
    database.publication.forEach((pub) =>{
        if(pub.id === req.body.pubId)
        {
            return pub.books.push(req.params.isbn);
        }
    });

    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn)
        {
             book.publication=(req.body.pubId)
             return;
        }
    });
    return res.json(
        {
            books: database.books,
            publication: database.publication,
            message: "successfully updated publication"
        }
    );
});

/*-------Delete--------*/
/*
Route          /book/delete/:isbn
Description    delete a book
Access         Public
Parameter      isbn
Methods        delete
*/

booky.delete("/book/delete/:isbn",(req,res) =>{
    const updatedBookDatabase = database.books.filter((book)=> book.ISBN !== req.params.isbn)
    database.books = updatedBookDatabase
    return res.json({books : database.books});
});

/*
Route          /author/book/delete/
Description    delete a author based on book
Access         Public
Parameter      isbn
Methods        delete
*/

booky.delete("/author/book/delete/:isbn",(req,res) =>{
    const deleteAuthor = database.author.filter((author)=> !author.books.includes(req.params.isbn));
    database.author = deleteAuthor
    return res.json({author: database.author});
})

/*
Route         /book/delete/author
Description    delete a author from  form a book and vice versa 
Access         Public
Parameter      isbn,authorID
Methods        delete
*/

//update the book database
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>
{
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthorList = book.author.filter(
            (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author =   newAuthorList;
            return;
        }
    });


//update the author database

database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)){
        const newBookList = eachAuthor.books.filter(
            (book) =>  book !==req.params.isbn
        );
        eachAuthor.books = newBookList;
        return;
    }
});
return res.json({
    book: database.books,
    author: database.author,
    message: "Author was deleted!!!"
});

});

booky.listen(3000, () => {
    console.log("Server is running");
});