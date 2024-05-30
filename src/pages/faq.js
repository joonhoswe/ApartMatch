import React, { useState } from 'react';
import { Accordion, AccordionItem } from '../components/accordion';

export default function Faq() {
    const [activeButton, setActiveButton] = useState('What is TutorHive?');

    const questions = [
        { question: 'What is TutorHive?', answer: 'TutorHive is the first learning platform that rewards you for learning and retaining information!' },
        { question: 'How does TutorHive work?', answer: 'TutorHive uses a game-like level system and rewards you with prizes for completing lessons and quizzes.' },
        { question: 'What is the cost for me as a student?', answer: 'TutorHive\'s tutoring services start at $50/hour!' },
        { question: 'How can I apply to be a tutor?', answer: 'Check the "Become a Bee" tap in our menu to get started!' }
    ];

    return (
        <div className='bg-yellow-150 text-white w-full h-screen flex items-center justify-center'>
            <Accordion className="w-2/5 rounded-xl flex flex-col gap-4" onSetActiveButton={setActiveButton} value={questions[0].question}>
                {questions.map((button, index) => (
                    <AccordionItem key={index} value={button.question} trigger={button.question} className='bg-blue-150 rounded-xl outline outline-2 outline-white'>
                        <div className="text-white bg-blue-300 rounded-2xl p-4">
                            <p>{button.answer}</p>
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
