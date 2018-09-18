import React, { Component } from 'react';
import { Container, Content, Body, ListItem, Text, CheckBox } from 'native-base';
export default class CheckBoxExample extends Component {
    render() {
        return (
            <Container>
                <Content>
                    <ListItem>
                        <CheckBox checked={true} />
                        <Body>
                            <Text>Daily Stand Up</Text>
                        </Body>
                    </ListItem>
                    <ListItem>
                        <CheckBox checked={false} />
                        <Body>
                            <Text>Discussion with Client</Text>
                        </Body>
                    </ListItem>
                </Content>
            </Container>
        );
    }
}