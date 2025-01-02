import * as React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const UpdateProfile = () => {
   

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
            />
            <Button title="Update"  />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default UpdateProfile;