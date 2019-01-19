import React from 'react';
import ReactDOM from 'react-dom';
import ExpansionPanelList from './ExpansionPanelList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ExpansionPanelList panels={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
