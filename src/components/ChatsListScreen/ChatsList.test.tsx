import React from 'react';
import ReactDOM from 'react-dom';
import {
  cleanup,
  render,
  fireEvent,
  wait,
  waitForDomChange
} from '@testing-library/react';
import ChatsList from './ChatsList';
import { createBrowserHistory } from 'history'

describe('ChatsList', () => {
  afterEach(() => {
    cleanup();
    window.location.pathname = '/';
  });

  it('renders fetched chats data', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          chats: [
            {
              id: 1,
              name: 'Foo Bar',
              picture: 'https://localhost:4000/picture.jpg',
              lastMessage: {
                id: 1,
                content: 'Hello',
                createdAt: new Date('1 Jan 2019 GMT'),
              }
            }
          ]
        }
      })
    ); {
      const { container, getByTestId } = render(<ChatsList />);
      await waitForDomChange({ container });
      expect(getByTestId('name')).toHaveTextContent('Foo Bar');
      expect(getByTestId('picture')).toHaveAttribute(
        'src',
        'https://localhost:4000/picture.jpg'
      );
      expect(getByTestId('content')).toHaveTextContent('Hello');
      expect(getByTestId('date')).toHaveTextContent('02:00');
    }
  });

  it('should navigate to the target chat room on chat item click', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        data: {
          chats: [
            {
              id: 1,
              name: 'Foo Bar',
              picture: 'https://localhost:4000/picture.jpg',
              lastMessage: {
                id: 1,
                content: 'Hello',
                createdAt: new Date('1 Jan 2019 PDT'),
              }
            }
          ]
        }
      })
    );

    const history = createBrowserHistory();
    {
      const { container, getByTestId } = render(
        <ChatsList history={history} />
      );

      await waitForDomChange({ container });
      fireEvent.click(getByTestId('chat'));

      await wait(() => expect(history.location.pathname).toEqual('/chats/1'))
    }
  });
}); 
