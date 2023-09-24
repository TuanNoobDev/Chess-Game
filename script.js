// Đợi DOM được tải đầy đủ trước khi thực thi mã
document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Khởi Tạo Bàn Cờ
    const game = new Chess(); // Tạo phiên bản trò chơi Chess.js mới
    const moveHistory = document.getElementById('move-history'); // Nhận vùng chứa lịch sử di chuyển
    let moveCount = 1; // Khởi tạo số lần di chuyển
    let userColor = 'w'; // Khởi tạo màu của người dùng là màu trắng

    // Chức năng thực hiện các bước di chuyển ngẫu nhiên cho máy tính
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if (game.game_over()) {
            alert("Chiến Thắng!, nhấn nút Reset để bắt đầu ván đấu mới");
        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount); // Ghi lại và hiển thị nước đi cùng số lần di chuyển
            moveCount++; // Tăng số lần di chuyển
        }
    };

    // Chức năng ghi lại và hiển thị một nước đi trong lịch sử nước đi
     const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight; // Tự động cuộn đến bước di chuyển mới nhất
    };

    // Chức năng xử lý việc bắt đầu vị trí kéo
    const onDragStart = (source, piece) => {
        // Cho phép người dùng chỉ kéo các phần của riêng họ dựa trên màu sắc
        return !game.game_over() && piece.search(userColor) === 0;
    };

    // Chức năng xử lý quân rơi trên bảng
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount); // Ghi lại và hiển thị nước đi cùng số lần di chuyển
        moveCount++;
    };

    // Chức năng xử lý phần cuối của hoạt ảnh chụp nhanh
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    // Tùy chọn cấu hình cho bàn cờ
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    // Khởi tạo bàn cờ
    board = Chessboard('board', boardConfig);

    // Trình xử lý sự kiện cho nút "Chơi lại"
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    // Trình xử lý sự kiện cho nút "Đặt vị trí"
    // document.querySelector('.set-pos').addEventListener('click', () => {
    // const fen = prompt("Enter the FEN notation for the desired position!");
    //     if (fen !== null) {
    //         if (game.load(fen)) {
    //              board.position(fen);
    //              moveHistory.textContent = '';
    //              moveCount = 1;
    //              userColor = 'w';
    //         } else {
    //              alert("Invalid FEN notation. Please try again.");
    //     }
    // }
    // });

    // Trình xử lý sự kiện cho nút "Flip Board"
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        // Chuyển đổi màu của người dùng sau khi lật bảng
        userColor = userColor === 'w' ? 'b' : 'w';
    });

});

// Update
let info = document.getElementById('info');
let reset = document.getElementById('reset');
let info2 = document.getElementById('info2');
let notifications = document.querySelector('.notifications');

function createToast(type, icon, title, text){
    let newToast = document.createElement('div');
    newToast.innerHTML = `
        <div class="toast ${type}">
                <i class="${icon}"></i>
                <div class="content">
                    <div class="title">${title}</div>
                    <span>${text}</span>
                </div>
                <i class="close fa-solid fa-xmark"
                onclick="(this.parentElement).remove()"
                ></i>
            </div>`;

    notifications.appendChild(newToast);
    newToast.timeOut = setTimeout(() => newToast.remove(),5000)
}

info.onclick = function(){
    let type = 'info';
    let icon = 'fa-solid fa-circle-info';
    let title = 'Thông Tin';
    let text = 'Đang cập nhật chế độ.';
    createToast(type, icon, title, text);
}

reset.onclick = function(){
    let type = 'succes';
    let icon = 'fa-solid fa-circle-check';
    let title = 'Reset thành công';
    let text = 'Chuẩn bị ván đấu mới xong.';
    createToast(type, icon, title, text);
}

info2.onclick = function(){
    let type = 'succes';
    let icon = 'fa-solid fa-circle-check';
    let title = 'Thông Tin';
    let text = 'Yêu cầu của bạn đã được gửi.';
    createToast(type, icon, title, text);
}