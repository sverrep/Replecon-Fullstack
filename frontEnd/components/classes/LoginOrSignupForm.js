import React, { Component } from 'react';
import { Button, View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import getIP from '../settings/settings.js';
import axios from 'axios';


class LoginOrSignupForm extends Component {

    state = {
        email: '',
        password: '',
        first_name: '',
        class_code: '',
        last_name: '',
        teacher: false,
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

    onLastNameChange(text) {
        this.setState({ last_name: text });
    }

    handleRequest() {
        const endpoint = this.props.studentcreate || this.props.teachercreate ? 'register' : 'login';
        const payload = { username: this.state.email, password: this.state.password } 
        
        if (this.props.studentcreate || this.props.teachercreate) {
            payload.first_name = this.state.first_name;
        }
        axios.post(getIP()+`/auth/${endpoint}/`, payload)
        .then(response => {
            const { token, user } = response.data;
            axios.defaults.headers.common.Authorization = `Token ${token}`;
            axios.get(getIP()+'/teachers/isTeacher/')
            .then(response => {
                this.setState({teacher: response.data}, () => {
                    if(this.props.studentcreate) {
                        axios.post(getIP()+'/students/create/', {class_code: this.state.class_code})
                        .then(response => {
                            this.props.navigation.navigate('Profile');
                    })
                    .catch(error => console.log(error));
                    }
                    else if (this.props.teachercreate) {
                        axios.post(getIP()+'/teachers/create/', {last_name: this.state.last_name})
                        .then(response => {
                            this.props.navigation.navigate('TeacherProfile');
                        })
                        .catch(error => console.log(error));
                    }
                    else if(this.state.teacher == true) {
                        this.props.navigation.navigate('TeacherProfile');
                    }
                    else {
                        
                        this.props.navigation.navigate('Profile');
                    }
                });
            })
            .catch(error => console.log(error));
            
        })
        .catch(error => console.log(error));
    }

    renderCreateForm() {
        const { fieldStyle, textInputStyle } = style;
        if (this.props.studentcreate) {
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
        else if(this.props.teachercreate) {
            return (
                <View style={{flex: 1, alignItems: 'center'}}>
                    <View style={fieldStyle}>
                        <TextInput
                        placeholder="First Name"
                        autoCorrect={false}
                        onChangeText={this.onFirstNameChange.bind(this)}
                        style={textInputStyle}
                        />
                    </View>
                    <View style={fieldStyle}>
                    <TextInput
                        placeholder="Last Name"
                        autoCorrect={false}
                        onChangeText={this.onLastNameChange.bind(this)}
                        style={textInputStyle}
                        />
                    </View>
                </View>
            );
        }
    }

    renderButton() {
        const buttonText = this.props.studentcreate || this.props.teachercreate ? 'Create' : 'Login';
        return (
            <Button title={buttonText} onPress={this.handleRequest.bind(this)}/>
        );
    }


    renderCreateLink() {
        if (!this.props.studentcreate && !this.props.teachercreate) {
            const { accountCreateTextStyle } = style;
            return (
                <Text style={accountCreateTextStyle}>
                    Or 
                    <Text style={{ color: 'blue' }} onPress={() => this.props.navigation.navigate('StudentSignUp')}>
                        {' Student Sign-up'}
                    </Text>
                    {'\n\n'}
                    Or 
                    <Text style={{ color: 'blue' }} onPress={() => this.props.navigation.navigate('TeacherSignUp')}>
                        {' Teacher Sign-up'}
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