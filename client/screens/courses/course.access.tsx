
// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
//     TextInput,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Loader from "@/components/loader/loader";
// import { router, useLocalSearchParams } from "expo-router";
// import axios from "axios";
// import { SERVER_URI } from "@/utils/uri";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { WebView } from "react-native-webview";
// import { widthPercentageToDP } from "react-native-responsive-screen";
// import QuestionsCard from "@/components/cards/question.card";
// import { Toast } from "react-native-toast-notifications";
// import ReviewCard from "@/components/cards/review.card";
// import { FontAwesome } from "@expo/vector-icons";
// import useUser from "@/hooks/auth/useUser";

// export default function CourseAccessScreen() {
//     const [isLoading, setisLoading] = useState(true);
//     const { user } = useUser();
//     const { courseData } = useLocalSearchParams();
//     const data: CoursesType = courseData ? JSON.parse(courseData as string) : {};
   

//     console.log("courseData:", courseData);


//     const [courseContentData, setcourseContentData] = useState<CourseDataType[]>(
//         []
//     );
//     const [activeVideo, setActiveVideo] = useState(0);
//     const [activeButton, setActiveButton] = useState("About");
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [quesion, setQuesion] = useState("");
//     const [rating, setRating] = useState(1);
//     const [review, setReview] = useState("");
//     const [reviewAvailabe, setreviewAvailabe] = useState(false);

//     useEffect(() => {
//         const subscription = async () => {
//             await fetchCourseContent();
//             const isReviewAvailble = data?.reviews?.find(
//                 (i: any) => i.user._id === user?._id
//             );
//             if (isReviewAvailble) {
//                 setreviewAvailabe(true);
//             }
//         };
//         subscription();
//     }, []);

//     const fetchCourseContent = async () => {
//         const accessToken = await AsyncStorage.getItem("access_token");
//         const refreshToken = await AsyncStorage.getItem("refresh_token");
//         await axios
//             .get(`${SERVER_URI}/get-course-content/${data._id}`, {
//                 headers: {
//                     "access-token": accessToken,
//                     "refresh-token": refreshToken,
//                 },
//             })
//             .then((res: any) => {
//                 setisLoading(false);
//                 setcourseContentData(res.data.content);
//             })
//             .catch((error) => {
//                 setisLoading(false);
//                 router.push("/(routes)/course-details");
//             });
//     };

//     const handleQuestionSubmit = async () => {
//         const accessToken = await AsyncStorage.getItem("access_token");
//         const refreshToken = await AsyncStorage.getItem("refresh_token");

//         await axios
//             .put(
//                 `${SERVER_URI}/add-question`,
//                 {
//                     question: quesion,
//                     courseId: data?._id,
//                     contentId: courseContentData[activeVideo]._id,
//                 },
//                 {
//                     headers: {
//                         "access-token": accessToken,
//                         "refresh-token": refreshToken,
//                     },
//                 }
//             )
//             .then((res) => {
//                 setQuesion("");
//                 Toast.show("Question created successfully!", {
//                     placement: "bottom",
//                 });
//                 fetchCourseContent();
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     const handleReviewSubmit = async () => {
//         const accessToken = await AsyncStorage.getItem("access_token");
//         const refreshToken = await AsyncStorage.getItem("refresh_token");

//         await axios
//             .put(
//                 `${SERVER_URI}/add-review/${data?._id}`,
//                 {
//                     review,
//                     rating,
//                 },
//                 {
//                     headers: {
//                         "access-token": accessToken,
//                         "refresh-token": refreshToken,
//                     },
//                 }
//             )
//             .then((res) => {
//                 setRating(1);
//                 setReview("");
//                 router.push({
//                     pathname: "/(routes)/course-details",
//                     params: { item: JSON.stringify(data) },
//                 });
//             })
//             .catch((error: any) => {
//                 console.log(error);
//             });
//     };

//     const renderStars = () => {
//         const starts = [];
//         for (let i = 1; i <= 5; i++) {
//             starts.push(
//                 <TouchableOpacity key={i} onPress={() => setRating(i)}>
//                     <FontAwesome
//                         name={i <= rating ? "star" : "star-o"}
//                         size={25}
//                         color={"#FF8D07"}
//                         style={{ marginHorizontal: 4, marginTop: -5 }}
//                     />
//                 </TouchableOpacity>
//             );
//         }
//         return starts;
//     };

//     return (
//         <>
//             {isLoading ? (
//                 <Loader />
//             ) : (
//                 <ScrollView stickyHeaderIndices={[0]} style={{ flex: 1, padding: 10 }}>
//                     <View
//                         style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 10 }}
//                     >
//                         <WebView
//                             source={{ uri: courseContentData[activeVideo]?.videoUrl! }}
//                             allowsFullscreenVideo={true}
//                         />
//                     </View>
//                     <View
//                         style={{
//                             flexDirection: "row",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                         }}
//                     >
//                         <TouchableOpacity
//                             style={styles.button}
//                             disabled={activeVideo === 0}
//                             onPress={() => setActiveVideo(activeVideo - 1)}
//                         >
//                             <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
//                                 Prev
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={styles.button}
//                             onPress={() => setActiveVideo(activeVideo + 1)}
//                         >
//                             <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
//                                 Next
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                     <View style={{ paddingVertical: 10 }}>
//                         <Text style={{ fontSize: 20, fontWeight: "bold" }}>
//                             {activeVideo + 1}. {courseContentData[activeVideo]?.title}
//                         </Text>
//                     </View>
//                     <View
//                         style={{
//                             flexDirection: "row",
//                             marginTop: 25,
//                             marginHorizontal: 10,
//                             backgroundColor: "#E1E9F8",
//                             borderRadius: 50,
//                             gap: 10,
//                         }}
//                     >
//                         <TouchableOpacity
//                             style={{
//                                 paddingVertical: 10,
//                                 paddingHorizontal: 42,
//                                 backgroundColor:
//                                     activeButton === "About" ? "#2467EC" : "transparent",
//                                 borderRadius: activeButton === "About" ? 50 : 0,
//                             }}
//                             onPress={() => setActiveButton("About")}
//                         >
//                             <Text
//                                 style={{
//                                     color: activeButton === "About" ? "#fff" : "#000",
//                                     fontFamily: "Nunito_600SemiBold",
//                                 }}
//                             >
//                                 About
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={{
//                                 paddingVertical: 10,
//                                 paddingHorizontal: 42,
//                                 backgroundColor:
//                                     activeButton === "Q&A" ? "#2467EC" : "transparent",
//                                 borderRadius: activeButton === "Q&A" ? 50 : 0,
//                             }}
//                             onPress={() => setActiveButton("Q&A")}
//                         >
//                             <Text
//                                 style={{
//                                     color: activeButton === "Q&A" ? "#fff" : "#000",
//                                     fontFamily: "Nunito_600SemiBold",
//                                 }}
//                             >
//                                 Q&A
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={{
//                                 paddingVertical: 10,
//                                 paddingHorizontal: 42,
//                                 backgroundColor:
//                                     activeButton === "Reviews" ? "#2467EC" : "transparent",
//                                 borderRadius: activeButton === "Reviews" ? 50 : 0,
//                             }}
//                             onPress={() => setActiveButton("Reviews")}
//                         >
//                             <Text
//                                 style={{
//                                     color: activeButton === "Reviews" ? "#fff" : "#000",
//                                     fontFamily: "Nunito_600SemiBold",
//                                 }}
//                             >
//                                 Reviews
//                             </Text>
//                         </TouchableOpacity>
//                     </View>

//                     {activeButton === "About" && (
//                         <View
//                             style={{
//                                 marginHorizontal: 16,
//                                 marginVertical: 25,
//                                 paddingHorizontal: 10,
//                             }}
//                         >
//                             <Text style={{ fontSize: 18, fontFamily: "Raleway_700Bold" }}>
//                                 About course
//                             </Text>
//                             <Text
//                                 style={{
//                                     color: "#525258",
//                                     fontSize: 16,
//                                     marginTop: 10,
//                                     textAlign: "justify",
//                                     fontFamily: "Nunito_500Medium",
//                                 }}
//                             >
//                                 {isExpanded
//                                     ? data?.description
//                                     : data?.description.slice(0, 302)}
//                             </Text>
//                             {data?.description.length > 302 && (
//                                 <TouchableOpacity
//                                     style={{ marginTop: 3 }}
//                                     onPress={() => setIsExpanded(!isExpanded)}
//                                 >
//                                     <Text
//                                         style={{
//                                             color: "#2467EC",
//                                             fontSize: 14,
//                                         }}
//                                     >
//                                         {isExpanded ? "Show Less" : "Show More"}
//                                         {isExpanded ? "-" : "+"}
//                                     </Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                     )}
//                     {activeButton === "Q&A" && (
//                         <View style={{ flex: 1, margin: 15 }}>
//                             <View>
//                                 <TextInput
//                                     value={quesion}
//                                     onChangeText={setQuesion}
//                                     placeholder="Ask a question..."
//                                     style={{
//                                         marginVertical: 20,
//                                         flex: 1,
//                                         textAlignVertical: "top",
//                                         justifyContent: "flex-start",
//                                         backgroundColor: "white",
//                                         borderRadius: 10,
//                                         height: 100,
//                                         padding: 10,
//                                     }}
//                                     multiline={true}
//                                 />
//                                 <View
//                                     style={{ flexDirection: "row", justifyContent: "flex-end" }}
//                                 >
//                                     <TouchableOpacity
//                                         style={[styles.button]}
//                                         disabled={quesion === ""}
//                                         onPress={() => handleQuestionSubmit()}
//                                     >
//                                         <Text
//                                             style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}
//                                         >
//                                             Submit
//                                         </Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                             <View style={{ marginBottom: 20 }}>
//                                 {courseContentData[activeVideo]?.questions
//                                     ?.slice()
//                                     .reverse()
//                                     .map((item: CommentType, index: number) => (
//                                         <QuestionsCard
//                                             item={item}
//                                             key={index}
//                                             fetchCourseContent={fetchCourseContent}
//                                             courseData={data}
//                                             contentId={courseContentData[activeVideo]._id}
//                                         />
//                                     ))}
//                             </View>
//                         </View>
//                     )}
//                     {activeButton === "Reviews" && (
//                         <View style={{ marginHorizontal: 16, marginVertical: 25 }}>
//                             {!reviewAvailabe && (
//                                 <View>
//                                     <View style={{ flexDirection: "row", alignItems: "center" }}>
//                                         <Text
//                                             style={{
//                                                 fontSize: 18,
//                                                 paddingBottom: 10,
//                                                 paddingLeft: 2,
//                                                 paddingRight: 5,
//                                             }}
//                                         >
//                                             Give one rating:
//                                         </Text>
//                                         {renderStars()}
//                                     </View>

//                                     <TextInput
//                                         value={review}
//                                         onChangeText={setReview}
//                                         placeholder="Give one review..."
//                                         style={{
//                                             flex: 1,
//                                             textAlignVertical: "top",
//                                             justifyContent: "flex-start",
//                                             backgroundColor: "white",
//                                             borderRadius: 10,
//                                             height: 100,
//                                             padding: 10,
//                                         }}
//                                         multiline={true}
//                                     />
//                                     <View
//                                         style={{ flexDirection: "row", justifyContent: "flex-end" }}
//                                     >
//                                         <TouchableOpacity
//                                             style={[styles.button]}
//                                             disabled={review === ""}
//                                             onPress={() => handleReviewSubmit()}
//                                         >
//                                             <Text
//                                                 style={{
//                                                     color: "#fff",
//                                                     fontSize: 18,
//                                                     fontWeight: "600",
//                                                 }}
//                                             >
//                                                 Submit
//                                             </Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                             )}
//                             <View style={{ rowGap: 25 }}>
//                                 {data?.reviews?.map((item: ReviewType, index: number) => (
//                                     <ReviewCard item={item} key={index} />
//                                 ))}
//                             </View>
//                         </View>
//                     )}
//                 </ScrollView>
//             )}
//         </>
//     );
// }

// const styles = StyleSheet.create({
//     button: {
//         width: widthPercentageToDP("35%"),
//         height: 40,
//         backgroundColor: "#2467EC",
//         marginVertical: 10,
//         borderRadius: 40,
//         alignItems: "center",
//         justifyContent: "center",
//     },
// });


import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';  // Import WebView

type CourseTag = {
    label: string;
    value: string;
};

type Year = {
    label: string;
    value: number;
};

type Subject = {
    label: string;
    value: string;
};

type Question = {
    _id: string;
    questionText: string;
    questionImage?: { url: string };
    answerImage?: { url: string };
    videoLink?: string;
    answerText?: string;
};

type PickerItem = CourseTag | Year | Subject;

const VimeoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
    const videoId = uri.split('/').pop()?.split('?')[0] ?? '';
    const embedUri = `https://player.vimeo.com/video/${videoId}`;

    return (
        <WebView
            source={{ uri: embedUri }}
            style={styles.video}
            javaScriptEnabled={true}
            domStorageEnabled={true}
        />
    );
};

const CourseAccessScreen: React.FC = () => {
    const [courseTags, setCourseTags] = useState<CourseTag[]>([]);
    const [years, setYears] = useState<Year[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
    const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
    const [currentPickerType, setCurrentPickerType] = useState<'tag' | 'year' | 'subject'>('tag');

    useEffect(() => {
        axios.get('https://solvit-test-deploy.onrender.com/api/v1/get-courses')
            .then(response => {
                const tags = response.data.courses.map((course: any) => ({
                    label: course.tags,
                    value: course.tags
                }));
                setCourseTags(tags);
            });
    }, []);

    useEffect(() => {
        if (selectedTag) {
            axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/years`)
                .then(response => {
                    const years = response.data.years.map((year: any) => ({
                        label: year.year.toString(),
                        value: year.year
                    }));
                    setYears(years);
                });
        }
    }, [selectedTag]);

    useEffect(() => {
        if (selectedYear) {
            axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/year/${selectedYear}/subjects`)
                .then(response => {
                    const subjects = response.data.subjects.map((subject: any) => ({
                        label: subject.name,
                        value: subject._id
                    }));
                    setSubjects(subjects);
                });
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedSubject) {
            axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/year/${selectedYear}/subject/${selectedSubject}/questions`)
                .then(response => {
                    setQuestions(response.data.questions);
                });
        }
    }, [selectedSubject]);

    const handlePickerSelect = (value: string | number) => {
        if (currentPickerType === 'tag') {
            setSelectedTag(value as string);
        } else if (currentPickerType === 'year') {
            setSelectedYear(value as number);
        } else if (currentPickerType === 'subject') {
            setSelectedSubject(value as string);
        }
        setIsPickerVisible(false);
    };

    const handlePickerType = (type: 'tag' | 'year' | 'subject') => {
        setCurrentPickerType(type);

        if (type === 'tag') {
            setPickerItems(courseTags);
        } else if (type === 'year') {
            setPickerItems(years.map(year => ({
                label: year.label,
                value: year.value.toString()
            })));
        } else if (type === 'subject') {
            setPickerItems(subjects.map(subject => ({
                label: subject.label,
                value: subject.value.toString()
            })));
        }
    };

    const Picker = () => (
        <View style={styles.modal}>
            <FlatList
                data={pickerItems}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handlePickerSelect(item.value)}
                        style={styles.item}
                    >
                        <Text>{item.label}</Text>
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.closeButton}>
                <Text>Close</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View>
                <Text>Select Course Tag:</Text>
                <TouchableOpacity onPress={() => {
                    handlePickerType('tag');
                    setIsPickerVisible(true);
                }} style={styles.button}>
                    <Text>{selectedTag ? courseTags.find(tag => tag.value === selectedTag)?.label : 'Select a tag...'}</Text>
                </TouchableOpacity>

                {selectedTag && (
                    <>
                        <Text>Select Year:</Text>
                        <TouchableOpacity onPress={() => {
                            handlePickerType('year');
                            setIsPickerVisible(true);
                        }} style={styles.button}>
                            <Text>{selectedYear ? years.find(year => year.value === selectedYear)?.label : 'Select a year...'}</Text>
                        </TouchableOpacity>
                    </>
                )}

                {selectedYear && (
                    <>
                        <Text>Select Subject:</Text>
                        <TouchableOpacity onPress={() => {
                            handlePickerType('subject');
                            setIsPickerVisible(true);
                        }} style={styles.button}>
                            <Text>{selectedSubject ? subjects.find(subject => subject.value === selectedSubject)?.label : 'Select a subject...'}</Text>
                        </TouchableOpacity>
                    </>
                )}

                {questions.map(question => (
                    <View key={question._id} style={styles.questionContainer}>
                        <Text>Question: {question.questionText}</Text>
                        {question.questionImage && <Image source={{ uri: question.questionImage.url }} style={styles.image} />}
                        {question.answerImage && <Image source={{ uri: question.answerImage.url }} style={styles.image} />}
                        {question.videoLink && <VimeoPlayer uri={question.videoLink} />}
                        {question.answerText && <Text>Answer: {question.answerText}</Text>}
                    </View>
                ))}
            </View>
            {isPickerVisible && <Picker />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    button: {
        padding: 10,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginVertical: 40,
        borderRadius: 10,
        elevation: 5,
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#ddd',
        alignItems: 'center',
    },
    questionContainer: {
        marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
    },
    video: {
        width: '100%',
        height: 200,
    },
});

export default CourseAccessScreen;
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import axios from 'axios';
// import { WebView } from 'react-native-webview';  // Import WebView

// type CourseTag = {
//     label: string;
//     value: string;
// };

// type Year = {
//     label: string;
//     value: number;
// };

// type Subject = {
//     label: string;
//     value: string;
// };

// type Question = {
//     _id: string;
//     questionText: string;
//     questionImage?: { url: string };
//     answerImage?: { url: string };
//     videoLink?: string;
//     answerText?: string;
// };

// type PickerItem = CourseTag | Year | Subject;

// const VimeoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
//     const videoId = uri.split('/').pop()?.split('?')[0] ?? '';
//     const embedUri = `https://player.vimeo.com/video/${videoId}`;

//     return (
//         <WebView
//             source={{ uri: embedUri }}
//             style={styles.video}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//         />
//     );
// };

// const CourseAccessScreen: React.FC = () => {
//     const [subjects, setSubjects] = useState<Subject[]>([]);
//     const [courseTags, setCourseTags] = useState<CourseTag[]>([]);
//     const [years, setYears] = useState<Year[]>([]);
//     const [questions, setQuestions] = useState<Question[]>([]);

//     const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
//     const [selectedYear, setSelectedYear] = useState<number | null>(null);

//     const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
//     const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
//     const [currentPickerType, setCurrentPickerType] = useState<'subject' | 'tag' | 'year'>('subject');

//     // Fetch subjects initially
//     useEffect(() => {
//         axios.get('https://solvit-test-deploy.onrender.com/api/v1/get-subjects')
//             .then(response => {
//                 const subjects = response.data.subjects.map((subject: any) => ({
//                     label: subject.name,
//                     value: subject._id
//                 }));
//                 setSubjects(subjects);
//             });
//     }, []);

//     // Fetch course tags based on selected subject
//     useEffect(() => {
//         if (selectedSubject) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/subject/${selectedSubject}/course-tags`)
//                 .then(response => {
//                     const tags = response.data.courseTags.map((tag: any) => ({
//                         label: tag,
//                         value: tag
//                     }));
//                     setCourseTags(tags);
//                 });
//         }
//     }, [selectedSubject]);

//     // Fetch years based on selected course tag
//     useEffect(() => {
//         if (selectedTag) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/years`)
//                 .then(response => {
//                     const years = response.data.years.map((year: any) => ({
//                         label: year.year.toString(),
//                         value: year.year
//                     }));
//                     setYears(years);
//                 });
//         }
//     }, [selectedTag]);

//     // Fetch questions based on selected year and subject
//     useEffect(() => {
//         if (selectedYear) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/year/${selectedYear}/subject/${selectedSubject}/questions`)
//                 .then(response => {
//                     setQuestions(response.data.questions);
//                 });
//         }
//     }, [selectedYear, selectedSubject]);

//     const handlePickerSelect = (value: string | number) => {
//         if (currentPickerType === 'subject') {
//             setSelectedSubject(value as string);
//         } else if (currentPickerType === 'tag') {
//             setSelectedTag(value as string);
//         } else if (currentPickerType === 'year') {
//             setSelectedYear(value as number);
//         }
//         setIsPickerVisible(false);
//     };

//     const handlePickerType = (type: 'subject' | 'tag' | 'year') => {
//         setCurrentPickerType(type);

//         if (type === 'subject') {
//             setPickerItems(subjects);
//         } else if (type === 'tag') {
//             setPickerItems(courseTags);
//         } else if (type === 'year') {
//             setPickerItems(years.map(year => ({
//                 label: year.label,
//                 value: year.value.toString()
//             })));
//         }
//     };

//     const Picker = () => (
//         <View style={styles.modal}>
//             <FlatList
//                 data={pickerItems}
//                 keyExtractor={(item) => item.value.toString()}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         onPress={() => handlePickerSelect(item.value)}
//                         style={styles.item}
//                     >
//                         <Text>{item.label}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//             <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.closeButton}>
//                 <Text>Close</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <ScrollView style={styles.container}>
//             <View>
//                 <Text>Select Subject:</Text>
//                 <TouchableOpacity onPress={() => {
//                     handlePickerType('subject');
//                     setIsPickerVisible(true);
//                 }} style={styles.button}>
//                     <Text>{selectedSubject ? subjects.find(subject => subject.value === selectedSubject)?.label : 'Select a subject...'}</Text>
//                 </TouchableOpacity>

//                 {selectedSubject && (
//                     <>
//                         <Text>Select Course Tag:</Text>
//                         <TouchableOpacity onPress={() => {
//                             handlePickerType('tag');
//                             setIsPickerVisible(true);
//                         }} style={styles.button}>
//                             <Text>{selectedTag ? courseTags.find(tag => tag.value === selectedTag)?.label : 'Select a course tag...'}</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}

//                 {selectedTag && (
//                     <>
//                         <Text>Select Year:</Text>
//                         <TouchableOpacity onPress={() => {
//                             handlePickerType('year');
//                             setIsPickerVisible(true);
//                         }} style={styles.button}>
//                             <Text>{selectedYear ? years.find(year => year.value === selectedYear)?.label : 'Select a year...'}</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}

//                 {questions.map(question => (
//                     <View key={question._id} style={styles.questionContainer}>
//                         <Text>Question: {question.questionText}</Text>
//                         {question.questionImage && <Image source={{ uri: question.questionImage.url }} style={styles.image} />}
//                         {question.answerImage && <Image source={{ uri: question.answerImage.url }} style={styles.image} />}
//                         {question.videoLink && <VimeoPlayer uri={question.videoLink} />}
//                         {question.answerText && <Text>Answer: {question.answerText}</Text>}
//                     </View>
//                 ))}
//             </View>
//             {isPickerVisible && <Picker />}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//     },
//     button: {
//         padding: 10,
//         backgroundColor: '#ddd',
//         marginVertical: 8,
//     },
//     modal: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: '#fff',
//         marginHorizontal: 20,
//         marginVertical: 40,
//         borderRadius: 10,
//         elevation: 5,
//     },
//     item: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     closeButton: {
//         padding: 10,
//         backgroundColor: '#ddd',
//         alignItems: 'center',
//     },
//     questionContainer: {
//         marginVertical: 10,
//     },
//     image: {
//         width: 100,
//         height: 100,
//         marginVertical: 10,
//     },
//     video: {
//         width: '100%',
//         height: 200,
//     },
// });

// export default CourseAccessScreen;
// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import axios from 'axios';
// import { WebView } from 'react-native-webview';  // Import WebView

// type CourseTag = {
//     label: string;
//     value: string;
// };

// type Year = {
//     label: string;
//     value: number;
// };

// type Subject = {
//     label: string;
//     value: string;
// };

// type Question = {
//     _id: string;
//     questionText: string;
//     questionImage?: { url: string };
//     answerImage?: { url: string };
//     videoLink?: string;
//     answerText?: string;
// };

// type PickerItem = CourseTag | Year | Subject;

// const VimeoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
//     const videoId = uri.split('/').pop()?.split('?')[0] ?? '';
//     const embedUri = `https://player.vimeo.com/video/${videoId}`;

//     return (
//         <WebView
//             source={{ uri: embedUri }}
//             style={styles.video}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//         />
//     );
// };

// const CourseAccessScreen: React.FC = () => {
//     const [subjects, setSubjects] = useState<Subject[]>([]);
//     const [courseTags, setCourseTags] = useState<CourseTag[]>([]);
//     const [years, setYears] = useState<Year[]>([]);
//     const [questions, setQuestions] = useState<Question[]>([]);

//     const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
//     const [selectedYear, setSelectedYear] = useState<number | null>(null);

//     const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
//     const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
//     const [currentPickerType, setCurrentPickerType] = useState<'subject' | 'tag' | 'year'>('subject');

//     // Fetch subjects initially
//     useEffect(() => {
//         axios.get('https://solvit-test-deploy.onrender.com/api/v1/get-subjects')
//             .then(response => {
//                 if (response.data.success) {
//                     const subjects = response.data.subjects.map((subject: any) => ({
//                         label: subject.name,
//                         value: subject._id
//                     }));
//                     setSubjects(subjects);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching subjects:', error);
//             });
//     }, []);

//     // Fetch course tags based on selected subject
//     useEffect(() => {
//         if (selectedSubject) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/subject/${selectedSubject}/course-tags`)
//                 .then(response => {
//                     if (response.data.success) {
//                         const tags = response.data.courseTags.map((tag: any) => ({
//                             label: tag,
//                             value: tag
//                         }));
//                         setCourseTags(tags);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching course tags:', error);
//                 });
//         }
//     }, [selectedSubject]);

//     // Fetch years based on selected course tag
//     useEffect(() => {
//         if (selectedTag) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/years`)
//                 .then(response => {
//                     if (response.data.success) {
//                         const years = response.data.years.map((year: any) => ({
//                             label: year.year.toString(),
//                             value: year.year
//                         }));
//                         setYears(years);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching years:', error);
//                 });
//         }
//     }, [selectedTag]);

//     // Fetch questions based on selected year and subject
//     useEffect(() => {
//         if (selectedYear && selectedSubject) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/year/${selectedYear}/subject/${selectedSubject}/questions`)
//                 .then(response => {
//                     if (response.data.success) {
//                         setQuestions(response.data.questions);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching questions:', error);
//                 });
//         }
//     }, [selectedYear, selectedSubject, selectedTag]);

//     const handlePickerSelect = (value: string | number) => {
//         if (currentPickerType === 'subject') {
//             setSelectedSubject(value as string);
//         } else if (currentPickerType === 'tag') {
//             setSelectedTag(value as string);
//         } else if (currentPickerType === 'year') {
//             setSelectedYear(value as number);
//         }
//         setIsPickerVisible(false);
//     };

//     const handlePickerType = (type: 'subject' | 'tag' | 'year') => {
//         setCurrentPickerType(type);

//         if (type === 'subject') {
//             setPickerItems(subjects);
//         } else if (type === 'tag') {
//             setPickerItems(courseTags);
//         } else if (type === 'year') {
//             setPickerItems(years.map(year => ({
//                 label: year.label,
//                 value: year.value.toString()
//             })));
//         }
//     };

//     const Picker = () => (
//         <View style={styles.modal}>
//             <FlatList
//                 data={pickerItems}
//                 keyExtractor={(item) => item.value.toString()}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         onPress={() => handlePickerSelect(item.value)}
//                         style={styles.item}
//                     >
//                         <Text>{item.label}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//             <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.closeButton}>
//                 <Text>Close</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <ScrollView style={styles.container}>
//             <View>
//                 <Text>Select Subject:</Text>
//                 <TouchableOpacity onPress={() => {
//                     handlePickerType('subject');
//                     setIsPickerVisible(true);
//                 }} style={styles.button}>
//                     <Text>{selectedSubject ? subjects.find(subject => subject.value === selectedSubject)?.label : 'Select a subject...'}</Text>
//                 </TouchableOpacity>

//                 {selectedSubject && (
//                     <>
//                         <Text>Select Course Tag:</Text>
//                         <TouchableOpacity onPress={() => {
//                             handlePickerType('tag');
//                             setIsPickerVisible(true);
//                         }} style={styles.button}>
//                             <Text>{selectedTag ? courseTags.find(tag => tag.value === selectedTag)?.label : 'Select a course tag...'}</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}

//                 {selectedTag && (
//                     <>
//                         <Text>Select Year:</Text>
//                         <TouchableOpacity onPress={() => {
//                             handlePickerType('year');
//                             setIsPickerVisible(true);
//                         }} style={styles.button}>
//                             <Text>{selectedYear ? years.find(year => year.value === selectedYear)?.label : 'Select a year...'}</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}

//                 {questions.map(question => (
//                     <View key={question._id} style={styles.questionContainer}>
//                         <Text>Question: {question.questionText}</Text>
//                         {question.questionImage && <Image source={{ uri: question.questionImage.url }} style={styles.image} />}
//                         {question.answerImage && <Image source={{ uri: question.answerImage.url }} style={styles.image} />}
//                         {question.videoLink && <VimeoPlayer uri={question.videoLink} />}
//                         {question.answerText && <Text>Answer: {question.answerText}</Text>}
//                     </View>
//                 ))}
//             </View>
//             {isPickerVisible && <Picker />}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//     },
//     button: {
//         padding: 10,
//         backgroundColor: '#ddd',
//         marginVertical: 8,
//     },
//     modal: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: '#fff',
//         marginHorizontal: 20,
//         marginVertical: 40,
//         borderRadius: 10,
//         elevation: 5,
//     },
//     item: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     closeButton: {
//         padding: 10,
//         backgroundColor: '#ddd',
//         alignItems: 'center',
//     },
//     questionContainer: {
//         marginVertical: 10,
//     },
//     image: {
//         width: 100,
//         height: 100,
//         marginVertical: 10,
//     },
//     video: {
//         width: '100%',
//         height: 200,
//         marginVertical: 10,
//     },
// });

// export default CourseAccessScreen;


// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
// import axios from 'axios';
// import { WebView } from 'react-native-webview';

// type CourseTag = {
//     label: string;
//     value: string;
// };

// type Year = {
//     label: string;
//     value: number;
// };

// type Subject = {
//     label: string;
//     value: string;
// };

// type Question = {
//     _id: string;
//     questionText: string;
//     questionImage?: { url: string };
//     answerImage?: { url: string };
//     videoLink?: string;
//     answerText?: string;
// };

// type PickerItem = CourseTag | Year | Subject;

// const VimeoPlayer: React.FC<{ uri: string }> = ({ uri }) => {
//     const videoId = uri.split('/').pop()?.split('?')[0] ?? '';
//     const embedUri = `https://player.vimeo.com/video/${videoId}`;

//     return (
//         <WebView
//             source={{ uri: embedUri }}
//             style={styles.video}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//         />
//     );
// };

// const CourseAccessScreen: React.FC = () => {
//     const [subjects, setSubjects] = useState<Subject[]>([]);
//     const [courseTags, setCourseTags] = useState<CourseTag[]>([]);
//     const [years, setYears] = useState<Year[]>([]);
//     const [questions, setQuestions] = useState<Question[]>([]);

//     const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
//     const [selectedTag, setSelectedTag] = useState<string | null>(null);
//     const [selectedYear, setSelectedYear] = useState<number | null>(null);
//     const [coursename, setCoursename] = useState('');
//     const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
//     const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
//     const [currentPickerType, setCurrentPickerType] = useState<'subject' | 'tag' | 'year'>('subject');

//     // Fetch Tags initially like WBJEE
//     useEffect(() => {
//         const Coursename = axios.get("http://localhost:8000/api/v1/get-courses");
//         setCoursename (Coursename.data.name);

//   })
// // NOW FETCH THE yeras to th course Like 2020 2022 in chemestry
  
//     useEffect(() => {
//         if (selectedSubject) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/subject/${selectedSubject}/course-tags`)
//                 .then(response => {
//                     if (response.data.success) {
//                         const tags = response.data.courseTags.map((tag: any) => ({
//                             label: tag,
//                             value: tag
//                         }));
//                         setCourseTags(tags);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching course tags:', error);
//                 });
//         }
//     }, [selectedSubject]);

//     // Fetch Subject  based on selected years
//     useEffect(() => {
//         if (selectedTag) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/years`)
//                 .then(response => {
//                     if (response.data.success) {
//                         const years = response.data.years.map((year: any) => ({
//                             label: year.year.toString(),
//                             value: year.year
//                         }));
//                         setYears(years);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching years:', error);
//                 });
//         }
//     }, [selectedTag]);

//     // Fetch questions based on selected year and subject
//     //fetch quenstion answer image text videlolink set the add the videlink in the videplyer so that it will play that video in player
//     useEffect(() => {
//         if (selectedYear && selectedSubject) {
//             axios.get(`https://solvit-test-deploy.onrender.com/api/v1/course/${selectedTag}/year/${selectedYear}/subject/${selectedSubject}/questions`)
//                 .then(response => {
//                     if (response.data.success) {
//                         setQuestions(response.data.questions);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error fetching questions:', error);
//                 });
//         }
//     }, [selectedYear, selectedSubject, selectedTag]);

//     const handlePickerSelect = (value: string | number) => {
//         if (currentPickerType === 'subject') {
//             setSelectedSubject(value as string);
//         } else if (currentPickerType === 'tag') {
//             setSelectedTag(value as string);
//         } else if (currentPickerType === 'year') {
//             setSelectedYear(value as number);
//         }
//         setIsPickerVisible(false);
//     };

//     const handlePickerType = (type: 'subject' | 'tag' | 'year') => {
//         setCurrentPickerType(type);

//         if (type === 'subject') {
//             setPickerItems(subjects);
//         } else if (type === 'tag') {
//             setPickerItems(courseTags);
//         } else if (type === 'year') {
//             setPickerItems(years.map(year => ({
//                 label: year.label,
//                 value: year.value.toString()
//             })));
//         }
//     };

//     const Picker = () => (
//         <View style={styles.modal}>
//             <FlatList
//                 data={pickerItems}
//                 keyExtractor={(item) => item.value.toString()}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         onPress={() => handlePickerSelect(item.value)}
//                         style={styles.item}
//                     >
//                         <Text>{item.label}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//             <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.closeButton}>
//                 <Text>Close</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     return (
//         <ScrollView style={styles.container}>
//             <View>
//                 <Text>Select Coursename:</Text>
//                 <TouchableOpacity onPress={() => {
//                     handlePickerType('subject');
//                     setIsPickerVisible(true);
//                 }} style={styles.button}>
//                     <Text>{setCoursename ? coursename.find(subject => subject.value === selectedSubject)?.label : 'Select a subject...'}</Text>
//                 </TouchableOpacity>

//                 {selectedSubject && (
//                     <>
//                         <Text>Select Course Tag:</Text>
//                         <TouchableOpacity onPress={() => {
//                             handlePickerType('tag');
//                             setIsPickerVisible(true);
//                         }} style={styles.button}>
//                             <Text>{selectedTag ? courseTags.find(tag => tag.value === selectedTag)?.label : 'Select a course tag...'}</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}

//                 {selectedTag && (
//                     <>
//                         <Text>Select Year:</Text>
//                         <TouchableOpacity onPress={() => {
//                             handlePickerType('year');
//                             setIsPickerVisible(true);
//                         }} style={styles.button}>
//                             <Text>{selectedYear ? years.find(year => year.value === selectedYear)?.label : 'Select a year...'}</Text>
//                         </TouchableOpacity>
//                     </>
//                 )}

//                 {questions.map(question => (
//                     <View key={question._id} style={styles.questionContainer}>
//                         <Text>Question: {question.questionText}</Text>
//                         {question.questionImage && <Image source={{ uri: question.questionImage.url }} style={styles.image} />}
//                         {question.answerImage && <Image source={{ uri: question.answerImage.url }} style={styles.image} />}
//                         {question.videoLink && <VimeoPlayer uri={question.videoLink} />}
//                         {question.answerText && <Text>Answer: {question.answerText}</Text>}
//                     </View>
//                 ))}
//             </View>
//             {isPickerVisible && <Picker />}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//     },
//     button: {
//         padding: 10,
//         backgroundColor: '#ddd',
//         marginVertical: 8,
//     },
//     modal: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: '#fff',
//         marginHorizontal: 20,
//         marginVertical: 40,
//         borderRadius: 10,
//         elevation: 5,
//     },
//     item: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     closeButton: {
//         padding: 10,
//         backgroundColor: '#ddd',
//         alignItems: 'center',
//     },
//     questionContainer: {
//         marginVertical: 10,
//     },
//     image: {
//         width: 100,
//         height: 100,
//         marginVertical: 10,
//     },
//     video: {
//         width: '100%',
//         height: 200,
//         marginVertical: 10,
//     },
// });

// export default CourseAccessScreen;
