import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ACCESS_TOKEN, BACKGROUND_COLOR, FIRETV_BASE_URL_STAGING, NORMAL_TEXT_COLOR, SLIDER_PAGINATION_UNSELECTED_COLOR, TAB_COLOR, VIDEO_AUTH_TOKEN } from '../constants'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NormalHeader from './normalHeader';

export default function ForgotPassword() {
    const [email, setEmail] = useState();
    const [EmailError, setEmailError] = useState();
    const [responseError, setresponseError] = useState();
    const [region, setregion] = useState();
    const resetEmailUser = async () => {
        const region = await AsyncStorage.getItem('country_code');
        if (email == "" || email == null) {
            setEmailError("Please enter your registered email id");
        }
        else {
            setEmailError("");
            setresponseError("");
            if (ValidateEmail(email)) {
                axios.post(FIRETV_BASE_URL_STAGING + 'users/forgot_password', {
                    access_token: ACCESS_TOKEN,
                    auth_token: VIDEO_AUTH_TOKEN,
                    user: { region: region, user_id: email }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => {

                    setresponseError(response.data.message)

                }).catch(error => {
                    setresponseError(error.response.data.error.message)
                })
            }
            else {
                setEmailError("Please enter a valid email");
            }
        }
    }

    const resetEmailUserInternational = async () => {
        const region = await AsyncStorage.getItem('country_code');
        setresponseError("");
        if (email == "" || email == null) {
            setEmailError("Please enter your registered email id / mobile number");
        }
        else {
            setEmailError("");
            setresponseError("");
            if (ValidateEmail(email)) {
                axios.post(FIRETV_BASE_URL_STAGING + 'users/forgot_password', {
                    access_token: ACCESS_TOKEN,
                    auth_token: VIDEO_AUTH_TOKEN,
                    user: { region: region, user_id: email }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => {

                    setresponseError(response.data.message)

                }).catch(error => {
                    setresponseError(error.response.data.error.message)
                })
            }
            else {
                const calling_code = await AsyncStorage.getItem('calling_code');
                axios.post(FIRETV_BASE_URL_STAGING + 'users/forgot_password', {
                    access_token: ACCESS_TOKEN,
                    auth_token: VIDEO_AUTH_TOKEN,
                    user: { region: region, user_id: calling_code + email }
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }).then(response => {

                    setresponseError(response.data.message)

                }).catch(error => {
                    setresponseError(error.response.data.error.message)
                })
            }
        }
    }
    function ValidateEmail(input) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (input.match(validRegex))
            return true;
        else
            return false;
    }
    const loadasyncdata = async()=>{
        const region = await AsyncStorage.getItem('country_code');
        setregion(region);
    }
    useEffect(()=>{
        loadasyncdata()
    })
    return (
        <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
            <NormalHeader></NormalHeader>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, padding: 20 }}>
                <Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 25, marginBottom: 20 }}>Forgot Password</Text>

                <Text style={styles.errormessage}>{responseError}</Text>
                {region == 'IN' ?
                    <TextInput onChangeText={setEmail} value={email} style={styles.textinput} placeholder="Registered Email Id*" placeholderTextColor={NORMAL_TEXT_COLOR} />
                    :
                    <TextInput onChangeText={setEmail} value={email} style={styles.textinput} placeholder="Registered Email Id / Mobile Number*" placeholderTextColor={NORMAL_TEXT_COLOR} />
                }
                <Text style={styles.errormessage}>{EmailError}</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 50 }}>
                    <TouchableOpacity onPress={region == 'IN' ? resetEmailUser : resetEmailUserInternational} style={styles.button}><Text style={{ color: NORMAL_TEXT_COLOR, fontSize: 16 }}>Submit</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textinput: { borderBottomColor: SLIDER_PAGINATION_UNSELECTED_COLOR, borderBottomWidth: 1, marginTop: 40, fontSize: 18, color: NORMAL_TEXT_COLOR, padding: 5, width: '100%' },
    button: { justifyContent: 'center', alignItems: 'center', backgroundColor: TAB_COLOR, color: NORMAL_TEXT_COLOR, width: 150, padding: 18, borderRadius: 10, marginRight: 20 },
    errormessage: { color: 'red', fontSize: 15 },
});