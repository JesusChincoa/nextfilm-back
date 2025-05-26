function RentalDTO({ id, userName, userId, filmName, filmId, price, bookDate, rentalDate, expectedReturnDate, returnDate }) {
  this.id = id;
  this.userName = userName;
  this.userId = userId;
  this.filmName = filmName;
  this.filmId = filmId;
  this.price = price;
  this.bookDate = bookDate;
  this.rentalDate = rentalDate;
  this.expectedReturnDate = expectedReturnDate;
  this.returnDate = returnDate;
}

module.exports = RentalDTO;