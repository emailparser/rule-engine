const lifecycleHooks = [
    {
        hook: "oncreate",
        title: "Email",
        placementIndex: 0,
        description: "Rules on email when it's received"
    },
    {
        hook: "beforesend",
        title: "Before saving",
        placementIndex: 1,
        description: "Rules on data before it's sent to your system"
    }
];

export const allowedHooks = lifecycleHooks.map((hook) => {
    return hook.hook;
});

export default lifecycleHooks;