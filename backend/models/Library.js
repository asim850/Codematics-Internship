const fs = require('fs-extra');
const path = require('path');

class Library {
  constructor() {
    this.booksPath = path.join(__dirname, '../data/books.json');
    this.membersPath = path.join(__dirname, '../data/members.json');
  }

  async getData(filePath) {
    return await fs.readJson(filePath);
  }

  async saveData(filePath, data) {
    await fs.writeJson(filePath, data, { spaces: 2 });
  }
  async addBook(bookData) {
    const books = await this.getData(this.booksPath);
    const newBook = { 
      ...bookData, 
      id: "B-" + Date.now(), 
      status: bookData.quantity > 0 ? "Available" : "Out of Stock" 
    };
    books.push(newBook);
    await this.saveData(this.booksPath, books);
    return newBook;
  }

  async deleteBook(id) {
    let books = await this.getData(this.booksPath);
    books = books.filter(b => b.id !== id);
    await this.saveData(this.booksPath, books);
  }
async updateEntry(type, id, updatedData) {
    const filePath = type === 'books' ? this.booksPath : this.membersPath;
    let data = await this.getData(filePath);
    const index = data.findIndex(item => item.id === id);

    if (index !== -1) {
        data[index] = { ...data[index], ...updatedData };
        await this.saveData(filePath, data);
        return data[index];
    }
    throw new Error("Update failed: Entry not found");
}

  async addMember(memberData) {
    const members = await this.getData(this.membersPath);
    const newMember = { ...memberData, id: "M-" + Date.now(), issuedBooks: [] };
    members.push(newMember);
    await this.saveData(this.membersPath, members);
    return newMember;
  }

  async deleteMember(id) {
    let members = await this.getData(this.membersPath);
    members = members.filter(m => m.id !== id);
    await this.saveData(this.membersPath, members);
  }
async issueBook(bookId, memberId) {
    const books = await this.getData(this.booksPath);
    const members = await this.getData(this.membersPath);

    const bookIndex = books.findIndex(b => b.id === bookId);
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (bookIndex !== -1 && memberIndex !== -1 && books[bookIndex].quantity > 0) {
        books[bookIndex].quantity -= 1;
        if (books[bookIndex].quantity === 0) books[bookIndex].status = "Out of Stock";

        if (!members[memberIndex].issuedBooks) members[memberIndex].issuedBooks = [];
        members[memberIndex].issuedBooks.push({
            bookId: books[bookIndex].id,
            title: books[bookIndex].title,
            issueDate: new Date().toLocaleDateString()
        });

        await this.saveData(this.booksPath, books);
        await this.saveData(this.membersPath, members);
        return { success: true };
    }
    throw new Error("Issue failed: Book unavailable or Member not found");
}
async returnBook(bookId, memberId) {
    const books = await this.getData(this.booksPath);
    const members = await this.getData(this.membersPath);

    const bookIndex = books.findIndex(b => b.id === bookId);
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (bookIndex !== -1 && memberIndex !== -1) {
        books[bookIndex].quantity += 1;
        books[bookIndex].status = "Available";
        members[memberIndex].issuedBooks = members[memberIndex].issuedBooks.filter(
            record => record.bookId !== bookId
        );

        await this.saveData(this.booksPath, books);
        await this.saveData(this.membersPath, members);
        return { success: true };
    }
    throw new Error("Return failed: Record not found");
}
}


module.exports = new Library();