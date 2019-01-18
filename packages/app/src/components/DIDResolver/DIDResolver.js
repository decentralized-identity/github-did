import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@material-ui/core';
import { SelectMultiple, ExpansionPanelList } from '../index';

import { namedWhitelist } from '../../constants';

const suggestions = namedWhitelist.map(item => ({
  value: item.did,
  label: item.name,
}));

class DIDResolver extends Component {
  state = {
    selected: [],
  };

  render() {
    const { resolveDID, did } = this.props;
    const { selected } = this.state;
    // todo move to panel selector
    const panels = selected.map(item => ({
      title: item.value,
      children: <pre>{JSON.stringify(did.dids[item.value], null, 2)}</pre>,
      disabled: false,
    }));
    return (
      <Paper style={{ padding: '16px', margin: '16px' }}>
        <SelectMultiple
          label={'Github DID Resolver'}
          placeholder={'Resolve multiple DIDs'}
          suggestions={suggestions}
          onChange={(values) => {
            values.map(v => !did.dids[v.value] && resolveDID(v.value));
            this.setState({
              selected: values,
            });
          }}
        />
        {/* spacer */}
        {panels.length !== 0 && <div style={{ display: 'block', height: '16px' }} />}
        <ExpansionPanelList panels={panels} />
      </Paper>
    );
  }
}

DIDResolver.propTypes = {
  resolveDID: PropTypes.func.isRequired,
  did: PropTypes.object.isRequired,
};

export default DIDResolver;
