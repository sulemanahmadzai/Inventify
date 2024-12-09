//write sum function in js for me

#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;unistd.h&gt;
#include &lt;signal.h&gt;
#include &lt;sys/wait.h&gt;

// Signal handler for SIGCHLD
void sigchld_handler(int sig) {
int status;
pid_t pid;

// Wait for the child process to finish
pid = wait(&amp;status);
if (pid &gt; 0) {
printf(&quot;Child process %d terminated with status %d\n&quot;, pid, WEXITSTATUS(status));
}
}

int main() {

Page 13

// Register the SIGCHLD handler
signal(SIGCHLD, sigchld_handler);

pid_t pid = fork();

if (pid == 0) {
// This is the child process
printf(&quot;Child process (PID: %d) is running...\n&quot;, getpid());
sleep(2); // Simulate work in the child process
printf(&quot;Child process (PID: %d) is exiting...\n&quot;, getpid());
exit(0); // Child process exits
} else if (pid &gt; 0) {
// This is the parent process
printf(&quot;Parent process (PID: %d) is waiting for the child...\n&quot;, getpid());
while (1) {
// Parent keeps running, waiting for SIGCHLD
sleep(1);
}
} else {
// Fork failed
perror(&quot;fork&quot;);
return 1;
}

return 0;
}