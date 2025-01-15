import React, {useEffect, useState} from 'react';
import {Alert, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import BackButton from '../components/BackButton';
import {getSearchSchools} from '../api/schoolApi';
import {useNavigation} from "@react-navigation/native";
import {postSubmitClassInfo} from "../api/classroomApi";

const OurClassInfoScreen = ({route}) => {
    const navigation = useNavigation();
    const {schoolName} = route.params ? route.params : {};

    const [keyword, setKeyword] = useState('');
    const [schoolNames, setSchoolNames] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [openGradePicker, setOpenGradePicker] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState('3');
    const [gradeItems, setGradeItems] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
    ]);
    const [classNumber, setClassNumber] = useState('1');

    useEffect(() => {
        if (schoolName) {
            setKeyword(schoolName.replace(/초등학교$/, ''));
        }
    }, [schoolName]);

    const handleSearch = async (text) => {
        setKeyword(text);
        if (text.trim() === '') {
            setSchoolNames([]);
            setShowSuggestions(false);

            return;
        }

        const result = await getSearchSchools(text);
        if (result) {
            setSchoolNames(result);
            setShowSuggestions(true);
        } else {
            setSchoolNames([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSchool = (school) => {
        const schoolNameWithoutType = school.replace(/초등학교$/, '');
        setKeyword(schoolNameWithoutType);
        setShowSuggestions(false);
        Keyboard.dismiss();
    };

    const handleNextStep = async () => {
        if (!keyword || !selectedGrade || !classNumber) {
            Alert.alert('등록 실패', '학교명, 학년, 반을 모두 입력해주세요.');
            return;
        }

        const payload = {
            schoolName: keyword + '초등학교',
            grade: selectedGrade,
            classNumber,
        };

        await postSubmitClassInfo(payload, navigation);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton/>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>우리 반 정보</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>학교</Text>
                    {schoolName ? (
                        <View style={styles.schoolNameContainer}>
                            <Text style={styles.schoolNameText}>{schoolName}</Text>
                        </View>
                    ) : (
                        <View style={styles.searchRow}>
                            <View style={styles.searchInputContainer}>
                                <TextInput
                                    placeholder="학교 이름"
                                    value={keyword}
                                    onChangeText={handleSearch}
                                    style={styles.searchInput}
                                />
                                <TouchableOpacity style={styles.searchButton}>
                                    <Text style={styles.searchButtonText}>🔍</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.schoolType}>초등학교</Text>
                        </View>
                    )}
                    {showSuggestions && (
                        <FlatList
                            data={schoolNames}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.suggestionItem}
                                    onPress={() => handleSelectSchool(item)}
                                >
                                    <Text style={styles.suggestionText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.suggestionList}
                        />
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>학년, 반</Text>
                    <View style={styles.gradeRow}>
                        <View style={styles.dropdownContainer}>
                            <DropDownPicker
                                open={openGradePicker}
                                value={selectedGrade}
                                items={gradeItems}
                                setOpen={setOpenGradePicker}
                                setValue={setSelectedGrade}
                                setItems={setGradeItems}
                                placeholder="3"
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                        </View>
                        <Text style={styles.gradeText}>학년</Text>

                        <TextInput
                            placeholder="1"
                            style={styles.classNumberInput} r
                            keyboardType="numeric"
                            onChangeText={setClassNumber}
                        />
                        <Text style={styles.gradeText}>반</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                <Text style={styles.nextButtonText}>확인</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        marginTop: -20,
        marginBottom: 20,
        marginLeft: -20,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3A4A5E',
        marginVertical: 20,
        textAlign: 'center',
        marginTop: 70,
    },
    content: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#3A4A5E',
        marginBottom: 8,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 15,
        backgroundColor: '#F9F9F9',
        paddingHorizontal: 10,
        flex: 0.5,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
    },
    searchButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#C9E6F0',
        borderRadius: 10,
    },
    searchButtonText: {
        fontSize: 16,
    },
    schoolType: {
        marginLeft: 10,
        fontSize: 16,
        color: '#3A4A5E',
    },
    schoolNameText: {
        fontSize: 16,
        color: '#3A4A5E',
    },
    suggestionList: {
        marginTop: 10,
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 10,
        maxHeight: 150,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    suggestionText: {
        fontSize: 16,
        color: '#3A4A5E',
    },
    gradeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        width: 67,
        borderColor: '#CCCCCC',
        backgroundColor: '#F9F9F9',
    },
    dropdownContainer: {
        borderColor: '#CCCCCC',
        maxHeight: 300,
    },
    classNumberInput: {
        width: 67,
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 15,
        backgroundColor: '#F9F9F9',
        textAlign: 'center',
    },
    gradeText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#3A4A5E',
        marginRight: 10,
    },
    nextButton: {
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 20,
        backgroundColor: '#C9E6F0',
        alignItems: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3A4A5E',
    },
});

export default OurClassInfoScreen;
