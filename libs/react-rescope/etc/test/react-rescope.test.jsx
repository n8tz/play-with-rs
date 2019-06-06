/*
 * Copyright (c)  2018 Wise Wild Web .
 *
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 *
 * @author : Nathanael Braun
 * @contact : caipilabs@gmail.com
 */

var child_process = require('child_process');
var os            = require('os');
var shortid       = require('shortid');
var path          = require('path');

import React                                                           from 'react';
import ReScope, { reScope, scopeToState, scopeToProps, scopeRef, Scope, Store } from '../dist/ReactReScope';
import { expect }                                                      from 'chai';
import Enzyme, { shallow, mount }                                      from 'enzyme';
import Adapter
                                                                       from 'enzyme-adapter-react-16';

import PropTypes                                       from 'prop-types';
Enzyme.configure({ adapter: new Adapter() });

var util  = require('util'),
    spawn = require('child_process').spawn,
    cmd;

describe('react-rescope :', () => {
    let comps  = {},
        scopes = {};
    
    
    class MyComp extends React.Component {
        render() {
            let { testAlias = {} } = this.props;
            console.log('render')
            return <div className={'target'}>{ testAlias.ok ? "ok" : '' }</div>
        }
    }
    
    it('it rescope & bind simple store on react component state', function () {
        
        @reScope(
            {
                test: class test extends Store {
                        static state = { ok: true };
                }
            }
        )
        @scopeToState(
            {
                @scopeRef
                testAlias: "test"
            }
        )
        class MyComp extends React.Component {
            render() {
                let { testAlias = {} } = this.state || {};
                return <div className={'target'}>{ testAlias.ok ? "ok" : '' }</div>
            }
        }
    
        const wrapper = mount(<MyComp/>);
        expect(wrapper.find('.target').text()).to.equal("ok");
    });
    it('it rescope & bind simple store on react component props', function () {
        
        @reScope(
            {
                test: class test extends Store {
                        static state = { ok: true };
                }
            }
        )
        @scopeToProps(
            {
                @scopeRef
                testAlias: "test"
            }
        )
        class MyComp extends React.Component {
            render() {
                let { testAlias = {} } = this.props;
                return <div className={'target'}>{ testAlias.ok ? "ok" : '' }</div>
            }
        }
    
        const wrapper = mount(<MyComp/>);
        expect(wrapper.find('.target').text()).to.equal("ok");
    });
    it('it react on store update', function  ( done ) {
        this.timeout(Infinity);
        let testScope;
        @reScope(
            {
                test: class test extends Store {
                        static state = { ok: false };
                        static actions = {
                            test:()=>({ok:true})
                        };
                }
            }
        )
        @scopeToProps(
            {
                @scopeRef
                testAlias: "test"
            }
        )
        class MyComp extends React.Component {
            render() {
                let { testAlias = {}, className } = this.props;
                //console.log('render')
                return <div className={'target'}>{ testAlias.ok ? "ok" : '' }</div>
            }
        }
        class MyCompTest extends React.Component {
            render() {
                return <MyComp test={true}/>
            }
        }
    
        const wrapper = mount(<MyCompTest/>);
    
        //console.log(wrapper.find(MyComp._originComponent).get(0))
        //testScope.actions.test();
        wrapper.find(MyComp._originComponent).get(0).props.$actions.test()
        setTimeout(
            ()=>wrapper.find('.target').text()=="ok"?done():done(new Error("not updated !!")),
            50
        )
        
    });
});