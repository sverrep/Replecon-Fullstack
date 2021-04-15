import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


class LoginOrSignupForm extends Component {

    state = {
        email: '',
        password: '',
        first_name: '',
        class_code: ''
    }

    onEmailChange(text) {
        this.setState({ email: text });
    }

    onPasswordChange(text) {
        this.setState({ password: text });
    }

    onFirstNameChange(text) {
        this.setState({ first_name: text });
    }

    onClassCodeChange(text) {
        this.setState({ class_code: text });
    }

    handleRequest() {
        const endpoint = this.props.create ? 'register' : 'login';
        const payload = { username: this.state.email, password: this.state.password } 
        
        if (this.props.create) {
            payload.first_name = this.state.first_name;
        }
        console.log(payload);
        
        axios.post(`http://192.168.0.6:8000/auth/${endpoint}/`, payload)
        .then(response => {
            const { token, user } = response.data;
            axios.defaults.headers.common.Authorization = `Token ${token}`;
            if(this.state.class_code != '') {
                axios.put('http://192.168.0.6:8000/students/class_code/', {class_code: this.state.class_code})
                .then(response => {
                    console.log(response.data, "success");

                    this.props.navigation.navigate('Profile');
            })
            .catch(error => console.log(error));
            }
            else {
                this.props.navigation.navigate('Profile');
            }
        })
        .catch(error => console.log(error));
    }

    renderCreateForm() {
        const { fieldStyle, textInputStyle } = style;
        if (this.props.create) {
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
            <View style={fieldStyle}>
                <TextInput
                placeholder="Name"
                autoCorrect={false}
                onChangeText={this.onFirstNameChange.bind(this)}
                style={textInputStyle}
                />
                </View>
            <View style={fieldStyle}>
                <TextInput
                placeholder="Class Code"
                autoCorrect={false}
                onChangeText={this.onClassCodeChange.bind(this)}
                style={textInputStyle}
                />
            </View>
            </View>
        );
        }
    }

    renderButton() {
        const buttonText = this.props.create ? 'Create' : 'Login';
        return (
            <Button title={buttonText} onPress={this.handleRequest.bind(this)}/>
        );
    }


    renderCreateLink() {
        if (!this.props.create) {
        const { accountCreateTextStyle } = style;
        return (
            <Text style={accountCreateTextStyle}>
            Or 
            <Text style={{ color: 'blue' }} onPress={() => this.props.navigation.navigate('SignUp')}>
                {' Sign-up'}
            </Text>
            </Text>
        );
        }
    }

    render() {
        const {
        formContainerStyle,
        fieldStyle,
        textInputStyle,
        buttonContainerStyle,
        accountCreateContainerStyle
        } = style;

        return (
        <View style={{ flex: 1, marginTop: 100 }}>
            <View style={formContainerStyle}>
            <View style={fieldStyle}>
                <TextInput
                placeholder="Email"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.onEmailChange.bind(this)}
                style={textInputStyle}
                />
            </View>
            <View style={fieldStyle}>
                <TextInput
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Password"
                onChangeText={this.onPasswordChange.bind(this)}
                style={textInputStyle}
                />
            </View>
            {this.renderCreateForm()}
            </View>
            <View style={buttonContainerStyle}>
            {this.renderButton()}
            <View style={accountCreateContainerStyle}>
                {this.renderCreateLink()}
            </View>
            </View>
        </View>
        );
    }
}


const style = StyleSheet.create({
  formContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    flex: 1,
    padding: 15
  },
  fieldStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },
  accountCreateTextStyle: {
    color: 'black'
  },
  accountCreateContainerStyle: {
    padding: 25,
    alignItems: 'center'
  }
});


export default function(props) {
    const navigation = useNavigation();
  
    return <LoginOrSignupForm {...props} navigation={navigation} />;
  }