import React from 'react';
import { mount } from 'enzyme';
import { assert } from 'chai';
import data from '../data/index';

import Child from '../index';

suite('<Child />', () => {

    let wrapper;

    const customData = data.attributes;

    setup(() => {

        wrapper = mount(<Child { ...customData } />);
    });

    test( 'Component rendered dynamic results', () => {

        assert.equal( wrapper.find( 'div' ).length, 1 );
    });



});
