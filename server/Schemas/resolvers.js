const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }
      throw new AuthenticationError('Not Logged in');
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Authentication('Incorrect credentials')
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveMovie: async (parent, { input }, { user }) => {
      if (user) {
        const updateUser = await User.findByIdAndUpdate(
          { _id: user._id },
          { $addToSet: { savedMovies: input } },
          { new: true, runValidators: true }
        );
        return updateUser;
      }
      throw new AuthenticationError('You need to be logged in');
    },
    removeMovie: async (parent, { movieId }, { user }) => {
      if (user) {
        const updateUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedMovies: { movieId: movieId } } },
          { new: true, runValidators: true }
        );
        return updateUser;
      }
      throw new AuthenticationError('You need to be logged in')
    }
  }
}

module.exports = resolvers;