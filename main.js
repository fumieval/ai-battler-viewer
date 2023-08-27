async function fetchAttacked(needle) {
  const query = needle === null ? "" : `?afterCreatedAt=${needle}`;
  const rawResult = await fetch(
    `https://ai-battle.alphabrend.com/api/battle-result/attacked${query}`,
    {
      credentials: "include",
      headers: {
        "User-Agent": "AI Battler Viewer",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "If-None-Match": '"iftgtdsc12120a"',
      },
      method: "GET",
      mode: "cors",
    }
  );
  return await rawResult.json();
}

const { createApp, ref } = Vue;

createApp({
  setup() {
    const battles = ref([]);
    const loading = ref(true);
    fetchAttacked(null).then((result) => {
      battles.value = result.battleLogs;
      loading.value = false;
    });

    const loadMore = () => {
      loading.value = true;
      fetchAttacked(battles.value[battles.value.length - 1].createdAt).then(
        (result) => {
          for (item of result.battleLogs) {
            battles.value.push(item);
          }
          loading.value = false;
        }
      );
    };

    return {
      battles,
      loadMore,
      loading,
    };
  },
}).mount("#app");
