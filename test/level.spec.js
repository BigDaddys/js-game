'use strict';

describe('Класс Level', () => {
  const player = new Actor();

  describe('Конструктор new Level', () => {
    it('Высота пустого уровня равна 0', () => {
      const level = new Level();

      expect(level.height).to.equal(0);
    });

    it('Ширина пустого уровня равна 0', () => {
      const level = new Level();

      expect(level.width).to.equal(0);
    });

    it('Высота уровня равна количеству строк сетки', () => {
      const lines = 100;
      const grid = new Array(lines);

      const level = new Level(grid);

      expect(level.height).to.equal(lines);
    });

    it('Ширина уровня равна количеству ячеек сетки', () => {
      const lines = 100;
      const cells = 50;
      const grid = new Array(lines).fill(new Array(cells));

      const level = new Level(grid);

      expect(level.width).to.equal(cells);
    });

    it('Если в строках разное количество ячеек, то ширина уровня равна количеству ячеек в самой длинной строке', () => {
      const lines = 100;
      const cells = 50;
      const maxCells = 100;
      const grid = new Array(lines).fill(new Array(cells));
      grid[73].length = maxCells;

      const level = new Level(grid);

      expect(level.width).to.equal(maxCells);
    });

    it('Имеет свойство status равное null', () => {
      const level = new Level();

      expect(level.status).to.be.null;
    });

    it('Имеет свойство finishDelay равное 1', () => {
      const level = new Level();

      expect(level.finishDelay).to.equal(1);
    });
  });

  describe('Метод isFinished', () => {
    it('По умолчанию вернет false', () => {
      const level = new Level();

      const isNotFinished = level.isFinished();

      expect(isNotFinished).to.be.false;
    });

    it('Вернут true, если status будет не равен null, и finishDelay меньше нуля', () => {
      const level = new Level();

      level.status = 'lost';
      level.finishDelay = -1;
      const isFinished = level.isFinished();

      expect(isFinished).to.be.true;
    });

    it('Вернут false, если status будет не равен null, но finishDelay будет больше нуля', () => {
      const level = new Level();

      level.status = 'lost';
      const isNotFinished = level.isFinished();

      expect(isNotFinished).to.be.false;
    });
  });

  describe('Метод actorAt', () => {
    const coin = new Actor();

    it('Выбросит исключение если передать не движущийся объект Actor', () => {
      const level = new Level(undefined, [player]);

      function fn() {
        level.actorAt({});
      }

      expect(fn).to.throw(Error);
    });

    it('Вернет undefined для пустого уровня', () => {
      const level = new Level();

      const noActor = level.actorAt(player);

      expect(noActor).to.be.undefined;
    });

    it('Вернет undefined для уровня в котором только один движущийся объект', () => {
      const level = new Level(undefined, [player]);

      const noActor = level.actorAt(player);

      expect(noActor).to.be.undefined;
    });

    it('Вернет undefined если ни один объект игрового поля не пересекается с переданным объектом', () => {
      const level = new Level(undefined, [player, coin]);
      player.move(1, 1);

      const actor = level.actorAt(player);

      expect(actor).to.be.equal(coin);
    });

    it('Вернет объект игрового поля, который пересекается с переданным объектом', () => {
      const level = new Level(undefined, [player, coin]);

      const actor = level.actorAt(player);

      expect(actor).to.be.equal(coin);
    });

  });

  describe('Метод obstacleAt', () => {
    const gridSize = 2;
    const grid = new Array(gridSize).fill(new Array(gridSize));
    const wallGrid = new Array(gridSize).fill(new Array(gridSize).fill('wall'));
    const lavaGrid = new Array(gridSize).fill(new Array(gridSize).fill('lava'));
    const size = new Vector(1, 1);

    it('Вернет undefined если объект не выходит за пределы уровня и ни с чем не пересекается', () => {
      const level = new Level(grid);
      const position = new Vector(0, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.undefined;
    });

    it('Вернет строку wall если левая граница объекта выходит за пределы уровня', () => {
      const level = new Level(grid);
      const position = new Vector(-1, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('Вернет строку wall если правая граница объекта выходит за пределы уровня', () => {
      const level = new Level(grid);
      const position = new Vector(gridSize, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('Вернет строку wall если верхняя граница объекта выходит за пределы уровня', () => {
      const level = new Level(grid);
      const position = new Vector(0, -1);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('Вернет строку lava если нижняя граница объекта выходит за пределы уровня', () => {
      const level = new Level(grid);
      const position = new Vector(0, gridSize);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('lava');
    });

    it('Вернет строку wall если площадь пересекается со стеной', () => {
      const level = new Level(wallGrid);
      const position = new Vector(0, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('wall');
    });

    it('Вернет строку lava если площадь пересекается с лавой', () => {
      const level = new Level(lavaGrid);
      const position = new Vector(0, 0);

      const wall = level.obstacleAt(position, size);

      expect(wall).to.be.equal('lava');
    });
  });

  describe('Метод removeActor', () => {
    const coin = new Actor();
    const lava = new Actor();

    it('Удаляет переданный движущийся объект', () => {
      const level = new Level(undefined, [ coin, lava ]);

      level.removeActor(coin);

      expect(level.actors.includes(coin)).to.be.false;
    });

    it('Не удаляет остальные движущиеся объекты', () => {
      const level = new Level(undefined, [ coin, lava ]);

      level.removeActor(coin);

      expect(level.actors.includes(lava)).to.be.true;
    });
  });

  describe('Метод noMoreActors', () => {
    const coin = { type: 'coin' };
    const lava = { type: 'lava' };

    it('Вернет истину, если движущихся объектов нет в уровне', () => {
      const level = new Level();

      expect(level.noMoreActors()).to.be.true;
    });

    it('Вернет истину, если в уровне нет движущихся объектов заданного типа', () => {
      const level = new Level(undefined, [ coin, lava ]);

      expect(level.noMoreActors('actor')).to.be.true;
    });

    it('Вернет ложь, если в уровне есть движущихся объекты заданного типа', () => {
      const level = new Level(undefined, [ coin, lava ]);

      expect(level.noMoreActors('coin')).to.be.false;
    });
  });

  describe('Метод playerTouched', () => {
    const goldCoin = { type: 'coin', title: 'Золото' };
    const bronzeCoin = { type: 'coin', title: 'Бронза' };

    it('Если передать lava первым аргументом, меняет статус уровня на lost', () => {
      const level = new Level();

      level.playerTouched('lava');

      expect(level.status).to.equal('lost');
    });

    it('Если передать fireball первым аргументом, меняет статус уровня на lost', () => {
      const level = new Level();

      level.playerTouched('fireball');

      expect(level.status).to.equal('lost');
    });

    it('Если передать coin первым аргументом и движущийся объект вторым, удаляет этот объект из уровня', () => {
      const level = new Level(undefined, [ goldCoin, bronzeCoin ]);

      level.playerTouched('coin', goldCoin);

      expect(level.actors).to.have.length(1);
      expect(level.actors).to.not.include(goldCoin);
    });

    it('Если удалить все монеты, то статус меняется на won', () => {
      const level = new Level(undefined, [ goldCoin, bronzeCoin ]);

      level.playerTouched('coin', goldCoin);
      level.playerTouched('coin', bronzeCoin);

      expect(level.status).to.equal('won');
    });
  });
});
