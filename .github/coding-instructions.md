When writing tests, follow these guidelines to ensure consistency and maintainability:
 - Look at where the function is actually being called from to understand its context and intent.
 - Don't assume that the function is working correctly just because it doesn't throw an error. It's possible that there are edge cases or specific conditions that could lead to unexpected/unintended behavior.
 - Make sure to run the tests after making changes to test files to ensure that everything is still functioning as expected. If there are failures, errors, or warnings, take what us returned in the test output and use that to continue troubleshooting and iterating until the test is passing and function being tested is doing what is expected.
 - **Focus on testing behavior rather than implementation details**: Test what the code accomplishes, not how it accomplishes it.
 - **Make tests resilient to refactoring**: Tests should pass even if internal implementation changes, as long as the behavior remains the same.
 - Never make up new functions just to make tests pass. Always build tests based on the functions that already exist. If a function needs to be updated/revised/refactored, that is also OK.
 - Do not just add a 'markTestSkipped' on tests that look difficult to write. Instead, explain the problem and ask for some additional context before trying again.

General guidlines:
- Never edit files that are git ignored.
- Don't add new README.md files. Update the exsting README.md if and only if the new information is truly necessary for new developers joining the project to know.
- When adding comments, always focus on the WHY rather than the WHAT. We don't need comments that just tell us what the code is doing.
- If you really have to create new temporary testing/debugging files in the root directory, remove them after you're done.
