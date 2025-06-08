<a href="/rooms">rooms</a>

<div id="menu">
    <div>
        <h2>Rooms</h2>
    </div>
    <button onclick="{() => isPopupVisible = true}">Create</button>
    <div id="popup" style="display: {isPopupVisible ? "" : "none"}">
        <div class="parameter">
            <label>Room name</label>
            <input type="text">
        </div>
        <button onclick="{createNewRoom}">Create</button>
    </div>
</div>

<style>
    #popup
    {
        background-color: orange;
        height: 40rem;
        width: 30rem;
        position: absolute;
        top: 10rem;
        opacity: 100%;
    }

    .parameter
    {
        width: 40%;
        display: flex;
        flex-direction: column;
        margin: 1rem;
        font-size: 1rem;
    }

    input
    {
        height: 1.5rem;
        font-size: 1rem;
        margin-top: 0.25rem;
    }
</style>

<script>
    let isPopupVisible = $state(false);

    function createNewRoom()
    {
        console.log("New Room");

        const request = new XMLHttpRequest();

        try
        {
            request.open("POST", "localhost");
        }
        catch (err)
        {
            console.error(err);
        }

    }
</script>