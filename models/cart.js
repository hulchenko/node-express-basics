const path = require('path');
const fs = require('fs');
const e = require('express');
const { createDecipher } = require('crypto');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

class Cart {
  static async add(course) {
    const cart = await Cart.fetch();

    const idx = cart.courses.findIndex((i) => i.id === course.id);
    const candidate = cart.courses[idx];

    if (candidate) {
      //course exists
      candidate.count++;
      cart.courses[idx] = candidate;
    } else {
      //need to add
      course.count = 1;
      cart.courses.push(course);
    }

    cart.price += +course.price; //to Number

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async remove(id) {
    const cart = await Cart.fetch();

    const idx = cart.courses.findIndex((i) => i.id === id);
    const course = cart.courses[idx];

    if (course.count === 1) {
      //delete
      cart.courses = cart.courses.filter((i) => i.id !== id);
    } else {
      //change quantity
      cart.courses[idx].count--;
    }

    cart.price -= course.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(cart);
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }
}

module.exports = Cart;
