namespace com.mindset.quiz;
using { managed, cuid } from '@sap/cds/common';

entity quiz : managed {
    key ID: String;
    title: String;
    // quizID: Association to many quizQuestions on quizID.questionID = $self;
    questions: Association to many quizQuestions on questions.quizID = $self.ID;
    conditionsID: Association to one quizConditions on conditionsID.ID = $self.ID;
}

entity quizConditions : managed {
    key ID: String;
    quizCond: Association to one quiz on quizCond.ID = $self.ID;
    quizEndTime: Time;
    quizDate: Date;
    quizNoQues: Integer;
    quizFullMarks: Integer;
    quizPassMarks: Integer;
    LearningSP: Date;
    LearningEP: Date;
}

entity users : managed {
    key ID: String;
    name: String;
    score: Integer;
    resAnswer: Association to one userResponse on resAnswer.ID = $self.ID;
}

entity quizQuestions : managed {
    key ID: String;
    quizID: String;
    // questionID: Association to one quiz on questionID.ID;
    quiz: Association to one quiz on quiz.ID = quizID;
    answers: Association to one quizAnswers on answers.ID = $self.ID;
    content: String;
    score: Integer;
}

entity quizAnswers : managed {
    // question: Association to one quizQuestions on question.answers = $self;
    key ID: String;
    answerID: Association to one quizQuestions on answerID.ID = $self.ID;
    content: String;
}

entity userResponse : managed {
    key ID: String;
    response: String;
    responseID: Association to one users on responseID.ID = $self.ID;
}
