import ErrorBag from './../src/errorBag';

it('adds a new error', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');

    expect(errors.first('name')).toBe('The name is invalid');
});

it('adds a new error with a scope', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1', 'scope1');

    expect(errors.first('name', 'scope1')).toBe('The name is invalid');
});

it('removes errors for a specific field', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');
    errors.add('email', 'The email is invalid', 'rule1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

    expect(errors.count()).toBe(3);
    errors.remove('name');
    expect(errors.count()).toBe(2);
    errors.remove('email');
    expect(errors.count()).toBe(0);
});

it('removes errors for a specific field and scope', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

    expect(errors.count()).toBe(3);
    errors.remove('email', 'scope1'); // remove the scope1 scoped field called email.
    expect(errors.count()).toBe(2);
    expect(errors.first('email', 'scope2')).toBe('The email is shorter than 3 chars.');
});

it('clears the errors', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');
    errors.add('email', 'The email is invalid', 'rule1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');
    expect(errors.count()).toBe(3);
    errors.clear();
    expect(errors.count()).toBe(0);
});

it('clears the errors within a scope', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');
    expect(errors.count()).toBe(3);
    errors.clear('scope1');
    expect(errors.count()).toBe(1);
});

it('checks for field selector existence', () => {
    const errors = new ErrorBag();

    expect(errors.selector('name:rule').name).toBe('name');
    expect(errors.selector('name:rule').rule).toBe('rule');

    expect(errors.selector('name')).toBe(null);
});

it('checks for field error existence', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1',);
    expect(errors.has('name')).toBe(true);
    expect(errors.has('name:rule1')).toBe(true);

    expect(errors.has('name:rule2')).toBe(false);
    expect(errors.has('email')).toBe(false);
});

it('checks for scoped field error existence', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1', 'scope1');

    expect(errors.has('name')).toBe(true);
    expect(errors.has('name', 'scope1')).toBe(true);
    expect(errors.has('name', 'scope2')).toBe(false); // no such scoped field.
});

it('fetches the errors count/length', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');
    errors.add('email', 'The email is invalid', 'rule1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

    expect(errors.count()).toBe(3);
});

it('fetches the first error message for a specific field', () => {
    const errors = new ErrorBag();
    errors.add('email', 'The email is invalid', 'rule1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

    errors.add('email', 'This is the third rule', 'rule2');
    errors.add('email', 'This is the forth rule', 'rule2');

    expect(errors.first('email')).toBe('The email is invalid');
    expect(errors.first('email:rule2')).toBe('This is the third rule');

    errors.clear();
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

    expect(errors.first('email')).toBe('The email is shorter than 3 chars.');
    expect(errors.first('name')).toBeNull();
});

it('fetches the first error message for a specific scoped field', () => {
    const errors = new ErrorBag();
    errors.add('email', 'The email is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

    expect(errors.first('email', 'scope1')).toBe('The email is invalid');
    expect(errors.first('email', 'scope2')).toBe('The email is shorter than 3 chars.');
    expect(errors.first('email', 'scope3')).toBeNull();
});

it('returns all errors in an array', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');
    errors.add('email', 'The email is invalid', 'rule1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

    expect(Array.isArray(errors.all())).toBe(true);
    expect(errors.all()).toEqual([
        'The name is invalid',
        'The email is invalid',
        'The email is shorter than 3 chars.'
    ]);
});

it('returns all scoped errors in an array', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

    expect(Array.isArray(errors.all())).toBe(true);
    expect(errors.all('scope1')).toEqual([
        'The name is invalid',
        'The email is invalid'
    ]);
});

it('collects errors for a specific field in an array', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');
    errors.add('email', 'The email is invalid', 'rule1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

    expect(errors.collect('email')).toEqual([
        'The email is invalid',
        'The email is shorter than 3 chars.'
    ]);
    expect(errors.collect('name')).toContain('The name is invalid');
});

it('collects errors for a specific field and scope', () => {
    const errors = new ErrorBag();
    errors.add('email', 'The email is not email.', 'rule1', 'scope1');
    errors.add('email', 'The email is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1', 'scope2');

    expect(errors.collect('email', 'scope1')).toEqual([
        'The email is not email.',
        'The email is invalid',
    ]);
    expect(errors.collect('email', 'scope2')).toContain('The email is shorter than 3 chars.');
});

it('groups errors by field name', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');
    errors.add('email', 'The email is invalid', 'rule1');
    errors.add('email', 'The email is shorter than 3 chars.', 'rule1');

    expect(errors.collect()).toEqual({
        email: [
            'The email is invalid',
            'The email is shorter than 3 chars.'
        ],
        name: [
            'The name is invalid'
        ]
    });
});

it('checks if there are any errors in the array', () => {
    const errors = new ErrorBag();
    expect(errors.any()).toBe(false);
    errors.add('name', 'The name is invalid', 'rule1');
    expect(errors.any()).toBe(true);
});

it('checks if there are any errors within a scope in the array', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1', 'scope1');
    errors.add('email', 'The email is invalid', 'rule1', 'scope1');

    expect(errors.any('scope3')).toBe(false);
    expect(errors.any('scope1')).toBe(true);
});

it('can get a specific error message for a specific rule', () => {
    const errors = new ErrorBag();
    errors.add('name', 'The name is invalid', 'rule1');
    errors.add('name', 'The name is really invalid', 'rule2');

    expect(errors.firstOf('name', 'rule1')).toBe('The name is invalid');
    expect(errors.firstOf('name', 'rule2')).toBe('The name is really invalid');

    expect(errors.firstOf('email', 'rule1')).toBe(null);
});
