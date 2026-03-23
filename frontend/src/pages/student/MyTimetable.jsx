import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, School, User, Download, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { studentService } from '../../services/studentService';
import { format, addWeeks, subWeeks } from 'date-fns';
import toast from 'react-hot-toast';

const MyTimetable = () => {
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState({});
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState('week');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    fetchTimetable();
  }, [currentWeek]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await studentService.getTimetable(currentWeek);
      setTimetable(data);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
      toast.error('Failed to load timetable');
      setTimetable(getMockTimetable());
    } finally {
      setLoading(false);
    }
  };

  const getMockTimetable = () => ({
    Monday: [
      { subject: 'Data Structures', time: '9:00-10:00', teacher: 'Dr. Smith', room: 'Room 101' },
      { subject: 'Algorithms', time: '10:00-11:00', teacher: 'Prof. Johnson', room: 'Room 102' }
    ],
    Tuesday: [
      { subject: 'Database Systems', time: '9:00-10:00', teacher: 'Dr. Williams', room: 'Room 103' },
      { subject: 'Operating Systems', time: '14:00-15:00', teacher: 'Prof. Brown', room: 'Room 104' }
    ],
    Wednesday: [
      { subject: 'Data Structures', time: '9:00-10:00', teacher: 'Dr. Smith', room: 'Room 101' },
      { subject: 'Computer Networks', time: '15:00-16:00', teacher: 'Dr. Davis', room: 'Room 105' }
    ],
    Thursday: [
      { subject: 'Algorithms', time: '10:00-11:00', teacher: 'Prof. Johnson', room: 'Room 102' },
      { subject: 'Database Systems', time: '14:00-15:00', teacher: 'Dr. Williams', room: 'Room 103' }
    ],
    Friday: [
      { subject: 'Operating Systems', time: '9:00-10:00', teacher: 'Prof. Brown', room: 'Room 104' },
      { subject: 'Computer Networks', time: '11:00-12:00', teacher: 'Dr. Davis', room: 'Room 105' }
    ],
    Saturday: [
      { subject: 'Lab Session', time: '9:00-12:00', teacher: 'Lab Instructor', room: 'Lab 201' }
    ]
  });

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const handlePrint = () => {
    window.print();
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Data Structures': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Algorithms': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      'Database Systems': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Operating Systems': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      'Computer Networks': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      'Lab Session': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
    };
    return colors[subject] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Timetable
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Weekly class schedule
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" onClick={handlePreviousWeek} icon={<ChevronLeft size={18} />}>
          Previous Week
        </Button>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Week of {format(currentWeek, 'MMM dd, yyyy')}
          </p>
          <Button variant="ghost" size="sm" onClick={handleCurrentWeek} className="mt-1">
            Current Week
          </Button>
        </div>
        <Button variant="outline" onClick={handleNextWeek} iconPosition="right" icon={<ChevronRight size={18} />}>
          Next Week
        </Button>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {days.map((day) => (
              <div key={day} className="text-center p-3 bg-primary-50 dark:bg-primary-900/30 rounded-xl font-semibold">
                {day}
              </div>
            ))}
            
            {/* Time Slots - This is a simplified view, actual implementation would be more complex */}
            {days.map((day) => (
              <div key={`${day}-schedule`} className="space-y-2">
                {(timetable[day] || []).map((class_, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-3 rounded-lg ${getSubjectColor(class_.subject)}`}
                  >
                    <p className="font-semibold text-sm">{class_.subject}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <Clock size={10} />
                      <span>{class_.time}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <User size={10} />
                      <span className="truncate">{class_.teacher}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      <School size={10} />
                      <span>{class_.room}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <Card title="Legend">
        <div className="flex flex-wrap gap-4">
          {Object.entries({
            'Data Structures': 'bg-blue-100',
            'Algorithms': 'bg-green-100',
            'Database Systems': 'bg-purple-100',
            'Operating Systems': 'bg-orange-100',
            'Computer Networks': 'bg-red-100',
            'Lab Session': 'bg-teal-100'
          }).map(([subject, color]) => (
            <div key={subject} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${color}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{subject}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <Calendar size={16} />
          Important Notes
        </h3>
        <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
          <li>Lab sessions require you to bring lab coats and ID cards</li>
          <li>Attendance will be marked within first 15 minutes of each class</li>
          <li>Check for any timetable changes on the notice board</li>
          <li>Contact respective teachers for any doubts about classes</li>
        </ul>
      </Card>
    </div>
  );
};

export default MyTimetable;