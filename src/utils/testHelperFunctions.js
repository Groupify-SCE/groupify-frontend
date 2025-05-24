import { BrowserRouter } from 'react-router-dom';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/Landing.page';

// Helper function to render with Router
const RouterRender = (element) => {
  render(<BrowserRouter>{element}</BrowserRouter>);
};

const elementExists = (elementTestId) => {
  return screen.queryByTestId(elementTestId) !== null;
};

const elementAllExist = (elementTestId) => {
  return screen.queryAllByTestId(elementTestId).length > 0;
};

const RenderLandingPage = async () => {
  await act(async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
  });
};

const MockFetchPosts = () => {
  const postsService = require('../services/postsService');
  postsService.fetchPosts = async () => [
    {
      _id: '66ae3eb28fa90888c16c8d51',
      user_id: '669ec453282db39dd89bb9ec',
      username: 'test',
      content: 'test1',
    },
    {
      _id: '66ae3ee48fa90888c16c8d52',
      user_id: '669ec453282db39dd89bb9ec',
      username: 'test',
      content: 'test2',
    },
  ];
};

const MockLoggedUser = () => {
  const loggedUser = require('../../services/loggedUser').loggedInUser;
  loggedUser.getUserId = () => '669ec453282db39dd89bb9ec';
  loggedUser.checkLoggedInForPage = () => false;
};

module.exports = {
  RouterRender,
  elementExists,
  elementAllExist,
  RenderLandingPage,
  MockFetchPosts,
  MockLoggedUser,
};
