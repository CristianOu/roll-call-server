const { handleStudentStats, calculateStudentsAttendance } = require('../routes/users');
const { calculateClassAttendanceBetweenDates } = require('../routes/users');

describe('test handleStudentStats()', () => {
  // all test cases have 3 parameters: description of test; array made of the attendance records; result object
  it.each([
    // test 1
    [
      // description
      'New course AND student is attending',
      // Arrange
      [
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1
        }
      ],
      // expected results
      { firstName: 'Brenden', lastName: 'Odom', 'Development of Large Systems': '100.00' }
    ],
    // test 2
    [
      // description
      'New course AND student is NOT attending',
      // Arrange
      [
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 0
        }
      ],
      // expected results
      { firstName: 'Brenden', lastName: 'Odom', Testing: '0.00' }
    ],
    // test 3
    [
      // description
      'Multiple course records AND student is attending',
      // Arrange
      [
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 1
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-05-10 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 1
        }
      ],
      // expected results
      { firstName: 'Brenden', lastName: 'Odom', Testing: '100.00' }
    ],
    // test 4
    [
      // description
      'Multiple records of the same course AND student is NOT attending',
      // Arrange
      [
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-05-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 1
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-05-10 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Testing', isAttending: 0
        }
      ],
      // expected results
      { firstName: 'Brenden', lastName: 'Odom', Testing: '50.00' }
    ],
    // test 5
    [
      // description
      'Multiple records of different courses',
      // Arrange
      [
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-03-03 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-03-10 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-03-17 08:30:00', teacher_name: 'Kane', teacher_surname: 'Vasquez', className: 'SD22w', courseName: 'Development of Large Systems', isAttending: 1
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-03-04 08:30:00', teacher_name: 'Camden', teacher_surname: 'Goff', className: 'SD22w', courseName: 'Testing', isAttending: 0
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-03-11 08:30:00', teacher_name: 'Camden', teacher_surname: 'Goff', className: 'SD22w', courseName: 'Testing', isAttending: 0
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-04-18 08:30:00', teacher_name: 'Camden', teacher_surname: 'Goff', className: 'SD22w', courseName: 'Testing', isAttending: 0
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-02-10 08:30:00', teacher_name: 'McKenzie', teacher_surname: 'Contreras', className: 'SD22w', courseName: 'Databases for Developers', isAttending: 1
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-02-17 08:30:00', teacher_name: 'McKenzie', teacher_surname: 'Contreras', className: 'SD22w', courseName: 'Databases for Developers', isAttending: 0
        },
        {
          firstName: 'Brenden', lastName: 'Odom', classStartDate: '2022-02-24 08:30:00', teacher_name: 'McKenzie', teacher_surname: 'Contreras', className: 'SD22w', courseName: 'Databases for Developers', isAttending: 0
        },
      ],
      // expected results
      {
        firstName: 'Brenden', lastName: 'Odom', 'Development of Large Systems': '100.00', Testing: '0.00', 'Databases for Developers': '33.33'
      }
    ]
  ])('%s', (attendance, data, result) => {
    // Assert + Act
    expect(handleStudentStats(data)).toEqual(result);
  });

  test('Empty array/No attendance', () => {
    // Arrange
    const parameter = [];

    // Assert + Act
    expect(() => { handleStudentStats(parameter); }).toThrow('Empty Array');
  });

  // Arrange
  const nonValidValues = [
    { value: '' },
    { value: 'string' },
    { value: true },
    { value: 12 }
  ];

  nonValidValues.forEach(({ value }) => {
    test(`Throws exception non numeric value: ${value}`, () => {
      // Assert + Act
      expect(() => { handleStudentStats(value); }).toThrow('Wrong data type');
    });
  });
});

describe('test calculateClassAttendanceBetweenDates()', () => {
  const record1 = { firstName: 'Iona', lastName: 'Shepherd', email: 'i-shepherd2902@hotmail.org' };
  const record2 = { firstName: 'Alexis', lastName: 'Herrera', email: 'herreraalexis@google.edu' };
  const record3 = { firstName: 'Mira', lastName: 'Mckay', email: 'm-mckay5458@yahoo.net' };
  it.each([
    // test 1
    [
      // description
      'Invalid lower boundary',
      // Arrange
      [
        { ...record1, classStartDate: new Date('2022-03-20T08:30:41'), isAttending: 1 },
        { ...record2, classStartDate: new Date('2022-03-20T08:30:40'), isAttending: 1 },
        { ...record3, classStartDate: new Date('2021-02-20T08:30:41'), isAttending: 1 }
      ],
      new Date('2022-03-01T11:23:14'), // current date
      new Date('2022-03-01T08:30:42'), // old date
      // expected results
      '0.00'
    ],
    // test 2
    [
      // description
      'Valid lower boundaries',
      // Arrange
      [
        { ...record1, classStartDate: new Date('2022-03-21T08:45:15'), isAttending: 1 },
        { ...record2, classStartDate: new Date('2022-03-21T08:45:15'), isAttending: 0 },
        { ...record3, classStartDate: new Date('2022-03-21T08:45:16'), isAttending: 1 }
      ],
      new Date('2022-03-30T10:41:24'), // current date
      new Date('2022-03-21T08:45:15'), // old date
      // expected results
      '66.67'
    ],
    // test 3
    [
      // description
      'Valid upper boundaries',
      // Arrange
      [
        { ...record1, classStartDate: new Date('2022-04-15T13:41:23'), isAttending: 1 },
        { ...record2, classStartDate: new Date('2022-04-15T13:41:23'), isAttending: 0 },
        { ...record3, classStartDate: new Date('2022-04-15T13:41:24'), isAttending: 1 }
      ],
      new Date('2022-04-15T13:41:24'), // current date
      new Date('2022-03-15T10:36:27'), // old date
      // expected results
      '66.67'
    ],
    // test 4
    [
      // description
      'Invalid upper boundary',
      // Arrange
      [
        { ...record1, classStartDate: new Date('2022-02-25T12:41:25'), isAttending: 1 },
        { ...record1, classStartDate: new Date('2022-02-25T12:41:25'), isAttending: 1 },
        { ...record1, classStartDate: new Date('2022-02-26T12:41:24'), isAttending: 1 }
      ],
      new Date('2022-02-25T12:41:24'), // current date
      new Date('2022-02-21T00:00:00'), // old date
      // expected results
      '0.00'
    ],
    // test 5
    [
      // description
      'Smaller than lowest boundary',
      // Arrange
      [
        { ...record1, classStartDate: new Date('1969-12-31T23:59:59'), isAttending: 1 },
        { ...record2, classStartDate: new Date('1966-05-05T12:12:12'), isAttending: 1 },
      ],
      new Date('2022-02-14T12:41:24'), // current date
      new Date('1970-01-01T00:00:00'), // old date
      // expected results
      '0.00'
    ],
    // test 6
    [
      // description
      'Bigger than highest boundary',
      // Arrange
      [
        { ...record1, classStartDate: new Date('2022-02-14T12:41:25'), isAttending: 1 },
        { ...record2, classStartDate: new Date('2023-02-14T12:41:24'), isAttending: 1 },
      ],
      new Date('2022-02-14T12:41:24'), // current date
      new Date('1970-01-01T00:00:00'), // old date
      // expected results
      '0.00'
    ],
    // test 7
    [
      // description
      'Between boundaries',
      // Arrange
      [
        { ...record1, classStartDate: new Date('2022-02-08T12:41:24'), isAttending: 1 },
        { ...record2, classStartDate: new Date('2022-02-09T12:41:24'), isAttending: 0 },
        { ...record3, classStartDate: new Date('2022-02-10T12:41:24'), isAttending: 0 },
        { ...record1, classStartDate: new Date('2022-02-11T12:41:24'), isAttending: 1 },
        { ...record2, classStartDate: new Date('2022-02-12T12:41:24'), isAttending: 1 },
      ],
      new Date('2022-02-14T12:41:24'), // current date
      new Date('2022-02-07T12:41:24'), // old date
      // expected results
      '60.00'
    ]
  ])('%s', (description, attendance, date, oldDate, result) => {
    // Assert + Act
    expect(calculateClassAttendanceBetweenDates(attendance, date, oldDate)).toEqual(result);
  });

  it.each([
    // test 8
    [
      // description
      'Different types of data',
      // Arrange
      [
        { ...record1, classStartDate: new Date('2022-02-10T11:41:24'), isAttending: 1 },
        { ...record2, classStartDate: new Date('2022-02-09T12:41:24'), isAttending: 1 },
      ],
      'current date', // current date
      'old date', // old date
      // expected results
      'Parameters are incorrect'
    ],
    // test 9
    [
      // description
      'Empty array/No attendance',
      // Arrange
      [],
      new Date('2022-02-14T12:41:24'), // current date
      new Date('2022-02-07T12:41:24'), // old date
      // expected results
      'Empty array'
    ]
  ])('%s', (description, attendance, date, oldDate, result) => {
    // Assert + Act
    expect(() => { calculateClassAttendanceBetweenDates(attendance, date, oldDate); }).toThrow(result);
  });
});

describe('calculate students\' overall attendance', () => {
  // cases that should fail
  it.each([
    [null, 'Unrecognized Student'],
    [[], 'Unrecognized Student'],
    [24, 'Unrecognized Student'],
    ['string', 'Unrecognized Student']
  ])('should throw error if given %s as an argument', (arg, expected) => {
    expect(() => {
      calculateStudentsAttendance(arg);
    }).toThrow(expected);
  });

  // cases that should succeed
  const expectedSet1 = {
    'john_doe@gmail.com': {
      firstName: 'John',
      lastName: 'Doe',
      attendance: '100.00'
    },
    'jane_doe@gmail.com': {
      firstName: 'Jane',
      lastName: 'Doe',
      attendance: '100.00'
    }
  };

  const expectedSet2 = {
    'john_doe@gmail.com': {
      firstName: 'John',
      lastName: 'Doe',
      attendance: '66.67'
    },
    'jane_doe@gmail.com': {
      firstName: 'Jane',
      lastName: 'Doe',
      attendance: '50.00'
    }
  };

  const expectedSet3 = {
    'john_doe@gmail.com': {
      firstName: 'John',
      lastName: 'Doe',
      attendance: '0.00'
    },
    'jane_doe@gmail.com': {
      firstName: 'Jane',
      lastName: 'Doe',
      attendance: '0.00'
    },
    'carl_nielsen@gmail.com': {
      firstName: 'Carl',
      lastName: 'Nielsen',
      attendance: '0.00'
    }
  };

  it.each([
    [
      'instances with full attendance',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@gmail.com',
          classStartDate: new Date('2022-05-03T06:30:00.000Z'),
          isAttending: 1
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane_doe@gmail.com',
          classStartDate: new Date('2022-05-03T06:30:00.000Z'),
          isAttending: 1
        }
      ],
      expectedSet1
    ],
    [
      'instances with partial attendance',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@gmail.com',
          classStartDate: new Date('2022-03-03T06:30:00.000Z'),
          isAttending: 0
        },
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@gmail.com',
          classStartDate: new Date('2022-05-03T06:30:00.000Z'),
          isAttending: 1
        },
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@gmail.com',
          classStartDate: new Date('2022-08-03T06:30:00.000Z'),
          isAttending: 1
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane_doe@gmail.com',
          classStartDate: new Date('2022-05-03T06:30:00.000Z'),
          isAttending: 1
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane_doe@gmail.com',
          classStartDate: new Date('2022-07-03T06:30:00.000Z'),
          isAttending: 0
        }
      ],
      expectedSet2
    ],
    [
      'instances with no attendance',
      [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@gmail.com',
          classStartDate: new Date('2022-05-03T06:30:00.000Z'),
          isAttending: 0
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane_doe@gmail.com',
          classStartDate: new Date('2022-05-03T06:30:00.000Z'),
          isAttending: 0
        },
        {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane_doe@gmail.com',
          classStartDate: new Date('2022-07-03T06:30:00.000Z'),
          isAttending: 0
        },
        {
          firstName: 'Carl',
          lastName: 'Nielsen',
          email: 'carl_nielsen@gmail.com',
          classStartDate: new Date('2022-07-03T06:30:00.000Z'),
          isAttending: 0
        },
        {
          firstName: 'Carl',
          lastName: 'Nielsen',
          email: 'carl_nielsen@gmail.com',
          classStartDate: new Date('2022-09-03T06:30:00.000Z'),
          isAttending: 0
        }
      ],
      expectedSet3
    ]
  ])('should return correct attendance for %s', (description, arg, expected) => {
    expect(calculateStudentsAttendance(arg)).toEqual(expected);
  });
});
